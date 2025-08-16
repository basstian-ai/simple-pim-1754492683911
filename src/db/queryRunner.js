/*
 Cancellable query runner with per-attempt timeout, retries, slow-query capture + EXPLAIN.
 - Uses AbortController to signal cancellation to DB clients that support an abort signal.
 - Retries transient failures (abort/timeouts and optionally custom transient marker).
 - Calls onSlow(sql, explain) when a query run exceeds slowQueryThresholdMs. If the DB client supports an EXPLAIN, we attempt to run it.
*/

class AbortError extends Error {
  constructor(message) {
    super(message || 'The operation was aborted');
    this.name = 'AbortError';
  }
}

/**
 * Run a single attempt of client.query with an abortable timeout.
 * If client.query accepts an options object with { signal }, it will be passed.
 */
async function attemptQuery(client, sql, params, timeoutMs, globalSignal) {
  const controller = new AbortController();
  const signal = controller.signal;

  // If a caller provided a global signal that is already aborted, propagate immediately
  if (globalSignal && globalSignal.aborted) {
    throw new AbortError('Global signal aborted');
  }

  let timeoutId;
  const race = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new AbortError('Query attempt timed out'));
    }, timeoutMs);
    if (globalSignal) {
      globalSignal.addEventListener('abort', () => {
        controller.abort();
        reject(new AbortError('Global signal aborted'));
      }, { once: true });
    }
  });

  // Build options for the client query if it supports a signal param.
  const maybeOpts = { signal };

  try {
    // Prefer client.query(sql, params, opts) if it accepts opts, but many clients accept (sql, params) only.
    const queryPromise = (async () => {
      // Some clients ignore unknown extra args; callers can implement support in their client wrapper.
      try {
        return await client.query(sql, params, maybeOpts);
      } catch (err) {
        // Some clients accept (sql, params) only. Try fallback signature without opts.
        if (err && err.message && err.message.includes('invalid argument')) throw err;
        try {
          return await client.query(sql, params);
        } catch (err2) {
          throw err2;
        }
      }
    })();

    const result = await Promise.race([queryPromise, race]);
    clearTimeout(timeoutId);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Determines if an error is eligible for retry.
 * By default, we retry on AbortError and on errors that look transient (could be expanded).
 */
function isRetryableError(err) {
  if (!err) return false;
  if (err.name === 'AbortError') return true;
  const msg = String(err.message || err.toString()).toLowerCase();
  if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('deadlock') || msg.includes('too many connections')) {
    return true;
  }
  return false;
}

/**
 * runQueryWithTimeout
 * options:
 * - client: DB client with async query(sql, params, { signal? })
 * - sql, params
 * - perAttemptTimeoutMs (default 5min)
 * - maxAttempts (default 3)
 * - slowQueryThresholdMs (if a single attempt runs longer than this, onSlow is invoked)
 * - onSlow(sql, explainText|null) called when attempt duration > slowQueryThresholdMs
 * - signal: optional AbortSignal to cancel the whole operation
 */
async function runQueryWithTimeout({
  client,
  sql,
  params = [],
  perAttemptTimeoutMs = 5 * 60 * 1000,
  maxAttempts = 3,
  slowQueryThresholdMs = 60 * 1000,
  onSlow = () => {},
  signal = null
}) {
  if (!client || typeof client.query !== 'function') throw new Error('client with query(sql, params, opts?) required');
  let attempt = 0;
  let lastErr = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    const start = Date.now();
    try {
      const res = await attemptQuery(client, sql, params, perAttemptTimeoutMs, signal);
      const duration = Date.now() - start;
      if (slowQueryThresholdMs && duration >= slowQueryThresholdMs) {
        // Try to collect an EXPLAIN plan if possible. Best-effort.
        let explainText = null;
        try {
          // Some DBs require different explain syntax. We prefix with EXPLAIN for typical SQL DBs.
          const explainSql = `EXPLAIN ${sql}`;
          const explainRes = await client.query(explainSql, params);
          // Normalize explain result to string when possible
          if (explainRes) {
            if (typeof explainRes === 'string') explainText = explainRes;
            else if (Array.isArray(explainRes.rows)) explainText = explainRes.rows.map(r => JSON.stringify(r)).join('\n');
            else explainText = String(explainRes);
          }
        } catch (ex) {
          // ignore explain errors
          explainText = null;
        }
        try {
          await onSlow(sql, explainText);
        } catch (ex) {
          // swallow errors from onSlow
        }
      }

      return res;
    } catch (err) {
      lastErr = err;
      // If global signal was aborted, throw immediately
      if (signal && signal.aborted) throw new AbortError('Global signal aborted');

      // If not retryable or we've exhausted attempts, throw
      if (!isRetryableError(err) || attempt >= maxAttempts) {
        // If this attempt exceeded slowQueryThreshold, attempt to collect EXPLAIN
        const duration = Date.now() - start;
        if (slowQueryThresholdMs && duration >= slowQueryThresholdMs) {
          let explainText = null;
          try {
            const explainSql = `EXPLAIN ${sql}`;
            const explainRes = await client.query(explainSql, params);
            if (explainRes) {
              if (typeof explainRes === 'string') explainText = explainRes;
              else if (Array.isArray(explainRes.rows)) explainText = explainRes.rows.map(r => JSON.stringify(r)).join('\n');
              else explainText = String(explainRes);
            }
          } catch (ex) {
            explainText = null;
          }
          try { await onSlow(sql, explainText); } catch (_) {}
        }

        // Attach attempt info to the error for diagnostics
        err.queryAttempts = attempt;
        err.lastQuery = sql;
        throw err;
      }

      // Retryable, wait with exponential backoff jitter
      const base = 100 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 100);
      const waitMs = Math.min(base + jitter, 5000);
      await new Promise((res) => setTimeout(res, waitMs));
      // loop to retry
    }
  }

  // If we get here, throw last error
  throw lastErr || new Error('Unknown query runner failure');
}

module.exports = {
  runQueryWithTimeout,
  AbortError,
  isRetryableError
};
