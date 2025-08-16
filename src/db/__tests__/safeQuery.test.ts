import { enforceDefaultLimit, wrapClient } from '../safeQuery';

describe('enforceDefaultLimit', () => {
  test('appends LIMIT when SELECT without LIMIT', () => {
    const sql = "SELECT id, name FROM users WHERE active = true ORDER BY id";
    const out = enforceDefaultLimit(sql, 1000);
    expect(out).toMatch(/LIMIT\s+1000/);
    expect(out).toContain('/* +default-limit */');
  });

  test('does not modify SELECT with existing LIMIT', () => {
    const sql = "SELECT * FROM items LIMIT 50";
    const out = enforceDefaultLimit(sql);
    expect(out).toBe(sql);
  });

  test('does not modify non-SELECT statements', () => {
    const insert = "INSERT INTO users (id, name) VALUES (1, 'a')";
    expect(enforceDefaultLimit(insert)).toBe(insert);
  });

  test('respects hard cap when maxLimit is huge', () => {
    const sql = "SELECT * FROM logs";
    // pass an absurd max to ensure HARD_CAP clamps it; HARD_CAP defaults to 100000
    const out = enforceDefaultLimit(sql, 1_000_000_000);
    expect(out).toMatch(/LIMIT\s+100000/);
  });
});

describe('wrapClient', () => {
  test('wraps client and applies limit', async () => {
    const queries: string[] = [];

    const fakeClient = {
      query: async (sql: string) => {
        queries.push(sql);
        return { rowCount: 0 };
      }
    };

    const logger = { warn: jest.fn() } as any;
    const wrapped = wrapClient(fakeClient as any, { maxLimit: 500, logger });

    await wrapped.query('SELECT * FROM foo');

    expect(queries.length).toBe(1);
    expect(queries[0]).toMatch(/LIMIT\s+500/);
    expect(logger.warn).toHaveBeenCalled();
  });

  test('does not alter SQL that already has LIMIT when wrapped', async () => {
    const queries: string[] = [];
    const fakeClient = { query: async (sql: string) => { queries.push(sql); return {}; } };
    const wrapped = wrapClient(fakeClient as any, { maxLimit: 100 });
    await wrapped.query('SELECT a FROM b LIMIT 10');
    expect(queries[0]).toBe('SELECT a FROM b LIMIT 10');
  });
});
