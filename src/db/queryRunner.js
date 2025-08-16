'use strict';

/**
 * Run a SQL query with a best-effort EXPLAIN capture if the query times out.
 *
 * The function races the main query against a timeout. If the timeout fires
 * before the main query resolves, it will attempt to run an EXPLAIN variant
 * of the original SQL to capture a plan for diagnostics. EXPLAIN capture is
 * best-effort and failures are surfaced but do not throw.
 *
 * client: any object with async query(sql, params) -> { rows }
 * sql: string
 * params: array (optional)
 * timeoutMs: integer milliseconds
 *
 * Returns: { rows|null, timedOut: boolean, explain?: string, explainError?: string }
 */
async function runQueryWithExplain(client, sql, params = [], timeoutMs = 5 * 60 * 1000) {
  if (!client || typeof client.query !== 'function') {
    throw new Error('client with query(sql, params) is required');
  }

  let timeoutHandle;

  // Wrap main query so we can mark it in the race result
  const mainPromise = client.query(sql, params).then(res => ({ __result__: true, res }));

  const timeoutPromise = new Promise(resolve => {
    timeoutHandle = setTimeout(() => resolve({ __timeout__: true }), timeoutMs);
  });

  const winner = await Promise.race([mainPromise, timeoutPromise]);

  // If main query finished first, clear timer and return rows
  if (winner && winner.__result__) {
    clearTimeout(timeoutHandle);
    return { rows: winner.res && winner.res.rows ? winner.res.rows : null, timedOut: false };
  }

  // Timed out. Attempt best-effort EXPLAIN capture.
  try {
    // Use ANALYZE for richer info where supported. Fall back to plain EXPLAIN if DB rejects.
    const explainSql = 'EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ' + sql;
    let explainRes;
    try {
      explainRes = await client.query(explainSql, params);
    } catch (err) {
      // Try a simpler EXPLAIN if the DB doesn't accept the first flavor
      explainRes = await client.query('EXPLAIN ' + sql, params);
    }

    // Normalize explain rows to a single text blob for diagnostics
    let explainText = '';
    if (explainRes && Array.isArray(explainRes.rows)) {
      explainText = explainRes.rows
        .map(r => {
          if (typeof r === 'string') return r;
          // Many drivers return objects like { 'QUERY PLAN': '...' } or arrays/objects.
          const vals = Object.values(r);
          if (vals.length === 0) return '';
          const v = vals[0];
          return typeof v === 'string' ? v : JSON.stringify(v);
        })
        .filter(Boolean)
        .join('\n');
    } else {
      explainText = String(explainRes);
    }

    return { rows: null, timedOut: true, explain: explainText };
  } catch (explainErr) {
    return { rows: null, timedOut: true, explainError: explainErr && explainErr.message ? explainErr.message : String(explainErr) };
  }
}

module.exports = { runQueryWithExplain };
