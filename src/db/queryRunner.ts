// Lightweight query runner with per-attempt timeout and EXPLAIN capture for diagnostics.
// Designed to work with node-postgres (pg) Client-like interfaces (client.query(sql, params)).

export class QueryTimeoutError extends Error {
  explain?: any;
  constructor(message: string, explain?: any) {
    super(message);
    this.name = 'QueryTimeoutError';
    this.explain = explain;
  }
}

export type PgClientLike = { query: (sql: string, params?: any[]) => Promise<any> };

export type RunOptions = {
  timeoutMs?: number;
  explainOnTimeout?: boolean;
  logger?: { warn: (...args: any[]) => void; error: (...args: any[]) => void };
};

export async function runQueryWithTimeout(
  client: PgClientLike,
  sql: string,
  params: any[] = [],
  opts: RunOptions = {}
) {
  const timeoutMs = opts.timeoutMs ?? 300_000; // default 5 minutes
  const explainOnTimeout = opts.explainOnTimeout ?? true;
  const logger = opts.logger ?? console;

  let timedOut = false;

  // Kick off the query
  const queryPromise = client.query(sql, params);

  // Create a timeout promise that rejects after timeoutMs
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      timedOut = true;
      const err = new QueryTimeoutError(`Query timed out after ${timeoutMs}ms`);
      reject(err);
    }, timeoutMs);

    // If the query finishes first, clear the timeout
    void queryPromise.then(() => clearTimeout(id), () => clearTimeout(id));
  });

  try {
    // Race the real query vs the timeout
    const res = await Promise.race([queryPromise, timeoutPromise]);
    return res;
  } catch (err: any) {
    // If we timed out, try to capture an EXPLAIN for diagnostics (best-effort)
    if (timedOut && explainOnTimeout) {
      try {
        // Only attempt EXPLAIN for SELECT-like statements to avoid side-effects
        if (/^\s*select/i.test(sql)) {
          const explainSql = `EXPLAIN (ANALYZE, VERBOSE, BUFFERS, FORMAT JSON) ${sql}`;
          try {
            const explainRes = await client.query(explainSql, params);
            // Attach explain results to the error for callers/tests to inspect
            err.explain = explainRes;
            logger.warn('Captured EXPLAIN for timed-out query');
          } catch (explainErr) {
            logger.error('Failed to capture EXPLAIN after timeout', explainErr);
            // Do not overwrite original timeout error
          }
        } else {
          logger.warn('Timed-out query is not SELECT-like; skipping EXPLAIN');
        }
      } catch (captureErr) {
        // Swallow any unexpected failure in explain capture path
        logger.error('Unexpected error while attempting to capture EXPLAIN', captureErr);
      }
    }

    throw err;
  }
}
