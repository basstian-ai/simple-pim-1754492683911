export type PGClient = { query: (sql: string, params?: any[]) => Promise<any> };

export class QueryTimeoutError extends Error {
  public readonly name = 'QueryTimeoutError';
  public readonly sql: string;
  constructor(sql: string, timeoutMs: number) {
    super(`Query exceeded timeout of ${timeoutMs}ms`);
    this.sql = sql;
  }
}

import { logger } from '../logging/logger';

/**
 * Capture an EXPLAIN plan for a given SQL statement using the provided client.
 * This is designed to be best-effort: failures are logged but do not mask the
 * original timeout error.
 */
export async function captureExplain(client: PGClient, sql: string, params: any[] = []) {
  // Use ANALYZE+BUFFERS and JSON output for richer diagnostics.
  const explainSql = `EXPLAIN (ANALYZE, BUFFERS, TIMING, FORMAT JSON) ${sql}`;
  try {
    const res = await client.query(explainSql, params);
    // Best-effort: log the explain output (upstream can pick up logs or send to storage)
    logger.info('Captured EXPLAIN plan', { explain: res && res.rows ? res.rows : res });
    return res;
  } catch (err) {
    logger.error('Failed to capture EXPLAIN plan', { err, sql });
    // Swallow the error here; caller will rethrow the original timeout.
    return null;
  }
}

/**
 * Run a query with a per-attempt timeout. On timeout, capture an EXPLAIN plan
 * and then throw a QueryTimeoutError. Returns whatever the underlying client's
 * query returns if it completes in time.
 */
export async function runQuery(
  client: PGClient,
  sql: string,
  params: any[] = [],
  opts?: { timeoutMs?: number; explainOnTimeout?: boolean }
) {
  const timeoutMs = opts?.timeoutMs ?? 300_000; // default 5 minutes
  const explainOnTimeout = opts?.explainOnTimeout ?? true;

  let timeoutId: NodeJS.Timeout | null = null;

  const queryPromise = client.query(sql, params);
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new QueryTimeoutError(sql, timeoutMs)), timeoutMs);
  });

  try {
    const result = await Promise.race([queryPromise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (err) {
    // If it's a timeout, attempt to capture EXPLAIN for diagnostics.
    if (err instanceof QueryTimeoutError) {
      if (explainOnTimeout) {
        try {
          await captureExplain(client, sql, params);
        } catch (e) {
          // captureExplain is best-effort; ensure we log failures but don't mask timeout
          logger.error('Error while capturing EXPLAIN after timeout', { err: e });
        }
      }
    }
    throw err;
  }
}
