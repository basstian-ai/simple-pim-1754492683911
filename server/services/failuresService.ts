export type FailureRow = {
  id: string;
  created_at: string; // ISO timestamp
  channel: string;
  job_id: string;
  error: string;
  payload?: any;
};

/**
 * Cursor-based fetch for recent failures.
 * Cursor format: "<ISO-timestamp>_<id>" representing the last-seen item (exclusive).
 * Returns items sorted newest-first and an optional nextCursor when more pages exist.
 */
export async function fetchRecentFailures(
  db: { query: (sql: string, params?: any[]) => Promise<{ rows: FailureRow[] }> },
  limit = 20,
  cursor?: string
): Promise<{ items: FailureRow[]; nextCursor?: string }>
{
  // Safety bounds
  const pageSize = Math.max(1, Math.min(limit, 100));
  const fetchCount = pageSize + 1; // fetch one extra to detect more pages

  let sql: string;
  let params: any[];

  if (cursor) {
    // cursor format: <timestamp>_<id>
    const [ts, id] = cursor.split('_');
    sql = `SELECT id, created_at, channel, job_id, error, payload
           FROM failures
           WHERE (created_at < $1 OR (created_at = $1 AND id < $2))
           ORDER BY created_at DESC, id DESC
           LIMIT $3`;
    params = [ts, id, fetchCount];
  } else {
    sql = `SELECT id, created_at, channel, job_id, error, payload
           FROM failures
           ORDER BY created_at DESC, id DESC
           LIMIT $1`;
    params = [fetchCount];
  }

  const res = await db.query(sql, params);
  const rows = res.rows || [];

  let items = rows.slice(0, pageSize);
  let nextCursor: string | undefined;
  if (rows.length === fetchCount) {
    // There is at least one more page
    const last = items[items.length - 1];
    nextCursor = `${last.created_at}_${last.id}`;
  }

  return { items, nextCursor };
}

export default fetchRecentFailures;
