/*
 * safeQuery.ts
 *
 * Runtime helper to reduce the chance of unintentionally running long-running
 * unbounded SELECTs by applying a sensible default LIMIT when a SELECT
 * statement is detected with no LIMIT clause.
 *
 * This is a lightweight mitigation: it does not replace proper query
 * optimization, indexing, nor application-level pagination. It is intended
 * as a safety net to prevent hitting global execution caps (e.g. 5min) for
 * accidental full-table scans.
 */

const DEFAULT_LIMIT = Number(process.env.QUERY_DEFAULT_LIMIT || 10000);
const HARD_CAP = Number(process.env.QUERY_DEFAULT_LIMIT_CAP || 100000);

function isSelect(sql: string): boolean {
  return /^\s*SELECT\b/i.test(sql);
}

function hasLimit(sql: string): boolean {
  // Quick heuristic to detect LIMIT usage. This is intentionally simple.
  return /\bLIMIT\b/i.test(sql);
}

/**
 * If sql looks like a SELECT and does not contain a LIMIT clause, append a LIMIT.
 * Returns the original SQL when no modification is necessary.
 */
export function enforceDefaultLimit(sql: string, maxLimit?: number): string {
  try {
    if (!sql || !isSelect(sql)) return sql;
    if (hasLimit(sql)) return sql;

    const configured = Number.isFinite(maxLimit as number) ? (maxLimit as number) : DEFAULT_LIMIT;
    const appliedLimit = Math.min(configured, HARD_CAP);

    // Append a LIMIT clause. Keep a small comment token so it's obvious the SQL
    // was modified by this helper when inspecting logs/DB audit.
    return sql.trim() + ` /* +default-limit */ LIMIT ${appliedLimit}`;
  } catch (err) {
    // In case of any unexpected failure, avoid changing SQL silently.
    console.warn('enforceDefaultLimit failed, returning original SQL', err);
    return sql;
  }
}

/**
 * Wrap a DB client to apply enforceDefaultLimit automatically to outgoing queries.
 * The client must implement a query(text, params?) => Promise<any> function.
 */
export function wrapClient<T extends { query: (...args: any[]) => Promise<any> }>(
  client: T,
  opts?: { maxLimit?: number; logger?: { warn: (...args: any[]) => void } }
): T {
  const logger = opts?.logger ?? console;

  const wrapped: any = { ...client };

  wrapped.query = async function (text: string, ...rest: any[]) {
    const originalSql = String(text || '');
    const sql = enforceDefaultLimit(originalSql, opts?.maxLimit);

    if (sql !== originalSql) {
      // Emit a structured warning so observability can pick it up.
      try {
        logger.warn('Applied default LIMIT to query to avoid long-running unbounded SELECT', {
          snippet: originalSql.slice(0, 200),
          appliedLimit: sql.match(/LIMIT\s+(\d+)/i)?.[1] ?? null,
          token: '+default-limit'
        });
      } catch (e) {
        // swallow logger errors
      }
    }

    // Delegate to the underlying client. Preserve call signature.
    return (client as any).query(sql, ...rest);
  };

  return wrapped as T;
}
