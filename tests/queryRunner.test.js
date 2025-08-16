const { runQueryWithExplain } = require('../src/db/queryRunner');

describe('runQueryWithExplain', () => {
  test('returns rows when query completes before timeout', async () => {
    const client = {
      query: jest.fn((sql, params) => Promise.resolve({ rows: [{ id: 1, name: 'ok' }] }))
    };

    const res = await runQueryWithExplain(client, 'SELECT 1', [], 1000);
    expect(res.timedOut).toBe(false);
    expect(res.rows).toEqual([{ id: 1, name: 'ok' }]);
    expect(res).not.toHaveProperty('explain');
  });

  test('on timeout, attempts EXPLAIN and returns explain text (best-effort)', async () => {
    // Simulate a slow main query and a fast EXPLAIN
    const mainDelay = 200;
    const timeoutMs = 50;

    const client = {
      query: jest.fn((sql, params) => {
        if (/^EXPLAIN/i.test(sql)) {
          // Simulate DB returning rows as objects with a single column value
          return Promise.resolve({ rows: [{ 'QUERY PLAN': 'Seq Scan on table' }, { 'QUERY PLAN': '...' }] });
        }
        return new Promise(resolve => setTimeout(() => resolve({ rows: [{ id: 2 }] }), mainDelay));
      })
    };

    const res = await runQueryWithExplain(client, 'SELECT pg_sleep(1); SELECT * FROM table', [], timeoutMs);
    expect(res.timedOut).toBe(true);
    expect(res.rows).toBeNull();
    expect(typeof res.explain).toBe('string');
    expect(res.explain).toContain('Seq Scan');
  });

  test('if EXPLAIN fails, return explainError instead of throwing', async () => {
    const client = {
      query: jest.fn((sql, params) => {
        if (/^EXPLAIN/i.test(sql)) {
          return Promise.reject(new Error('EXPLAIN not supported'));
        }
        // main query never resolves within timeout
        return new Promise(() => {});
      })
    };

    const res = await runQueryWithExplain(client, 'SELECT 1', [], 10);
    expect(res.timedOut).toBe(true);
    expect(res.rows).toBeNull();
    expect(res.explainError).toBeDefined();
  });
});
