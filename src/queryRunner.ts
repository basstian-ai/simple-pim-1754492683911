import { QueryTimeoutError } from './errors';
import { sendAlert } from './alerting';

export type QueryFn<T> = (signal: AbortSignal) => Promise<T>;

export type RunOptions = {
  /** per-attempt timeout in ms; default 5 minutes */
  timeoutMs?: number;
  /** number of retries after the first attempt (0 = only one attempt) */
  retries?: number;
  /** base backoff ms between retries */
  backoffMs?: number;
  /** multiplier for exponential backoff */
  backoffMultiplier?: number;
  /** optional callback for instrumentation on each retry */
  onRetry?: (err: unknown, attempt: number, timeoutMs: number) => void;
  /** enable sending an alert when all attempts fail */
  alertOnFailure?: boolean;
};

const DEFAULTS = {
  timeoutMs: 5 * 60 * 1000, // 5 minutes
  retries: 2,
  backoffMs: 200,
  backoffMultiplier: 2,
  alertOnFailure: true,
};

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    if (signal) {
      if (signal.aborted) {
        clearTimeout(id);
        return reject(new Error('aborted'));
      }
      const onAbort = () => {
        clearTimeout(id);
        reject(new Error('aborted'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

/**
 * Runs a provided async query function with per-attempt timeout, graceful cancellation (AbortSignal),
 * and a small retry/backoff strategy. Instrumentation hook is available for retries and failures.
 *
 * The provided query function should observe the AbortSignal where possible to allow server-side
 * cancellation and to avoid TTL-escaping operations.
 */
export async function runQueryWithTimeoutAndRetry<T>(
  fn: QueryFn<T>,
  opts?: RunOptions
): Promise<T> {
  const {
    timeoutMs,
    retries,
    backoffMs,
    backoffMultiplier,
    onRetry,
    alertOnFailure,
  } = { ...DEFAULTS, ...(opts || {}) };

  const totalAttempts = (retries ?? 0) + 1;
  let attempt = 0;
  let lastError: unknown = null;

  for (; attempt < totalAttempts; attempt++) {
    const controller = new AbortController();
    const { signal } = controller;

    // set a per-attempt timeout that triggers AbortController
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await fn(signal);
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      const wasAborted = (signal.aborted === true) || (err && (err as any).name === 'AbortError') || (err && (err as any).message === 'aborted');

      // If the attempt was aborted due to timeout, prefer a QueryTimeoutError when all attempts fail.
      // Otherwise propagate the underlying error on final attempt.
      const isLast = attempt === totalAttempts - 1;

      if (!isLast) {
        try {
          onRetry && onRetry(err, attempt + 1, timeoutMs!);
        } catch (_) {
          // ignore instrumentation errors
        }

        // backoff before next attempt; allow being interrupted by external abortion if caller provides a signal in future implementations
        const backoff = (backoffMs || 0) * Math.pow(backoffMultiplier || 1, attempt);
        try {
          // best-effort sleep
          // note: we don't pass a signal here because each attempt has its own controller
          await wait(backoff);
        } catch (_) {
          // ignore
        }

        // continue to next attempt
        continue;
      }

      // final attempt failed
      if (wasAborted) {
        const qte = new QueryTimeoutError(`query timed out after ${timeoutMs}ms (attempts=${totalAttempts})`, timeoutMs!, totalAttempts);
        // fire-and-forget alerting
        if (alertOnFailure) {
          void sendAlert({
            title: 'Query Duration Limit Exceeded',
            body: qte.message,
            severity: 'critical',
            meta: {
              attempts: totalAttempts,
              timeoutMs,
              lastError: String(lastError),
            },
          });
        }
        throw qte;
      }

      // non-timeout error on final attempt, propagate original error
      throw err;
    }
  }

  // should never reach here but satisfy typing
  throw lastError ?? new Error('query failed (unknown)');
}
