import { runQueryWithTimeout, QueryTimeoutError } from '../src/db/queryRunner';

// Jest-style test. This test verifies that when a long-running query times out,
// the runner attempts to capture an EXPLAIN (for SELECT statements) and attaches
// the explain result to the thrown QueryTimeoutError.

test('captures EXPLAIN on timeout for SELECT queries (best-effort)', async () => {
  // Mock client.query to simulate a hanging initial query and a succeeding EXPLAIN call.
  const mockQuery = jest.fn((sql: string, params?: any[]) => {
    if (/^\s*explain/i.test(sql)) {
      // Simulate explain returning quickly
      return Promise.resolve({ rows: [{ plan: 'mock-plan' }], rowCount: 1 });
    }
    // Simulate a query that never resolves (hang)
    return new Promise(() => {
      /* never resolves */
    });
  });

  const client = { query: mockQuery } as any;
  const logger = { warn: jest.fn(), error: jest.fn() };

  try {
    await runQueryWithTimeout(client, 'SELECT * FROM users WHERE id = $1', [1], {
      timeoutMs: 50,
      explainOnTimeout: true,
      logger,
    });
    // If we get here the test failed because the hung query should timeout
    throw new Error('expected query to timeout');
  } catch (err: any) {
    expect(err).toBeInstanceOf(QueryTimeoutError);
    // The runner should have tried an EXPLAIN and attached the result (best-effort)
    expect(err.explain).toBeDefined();
    expect(err.explain.rows).toBeDefined();

    // Ensure our mock was called at least twice: original sql + EXPLAIN
    expect(mockQuery.mock.calls.length).toBeGreaterThanOrEqual(2);

    const explainCall = mockQuery.mock.calls.find((call) => /^\s*EXPLAIN/i.test(call[0]));
    expect(explainCall).toBeDefined();
    // EXPLAIN should be invoked with the same params array we passed
    expect(explainCall![1]).toEqual([1]);

    // Logger should have been warned about capturing EXPLAIN
    expect(logger.warn).toHaveBeenCalledWith('Captured EXPLAIN for timed-out query');
  }
});
