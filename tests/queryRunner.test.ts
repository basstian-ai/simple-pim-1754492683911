import assert from 'assert';
import { runQuery } from '../src/db/queryRunner';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('queryRunner', () => {
  it('captures EXPLAIN on timeout and throws QueryTimeoutError', async () => {
    let explainCalled = false;

    const client = {
      async query(sql: string, _params?: any[]) {
        if (sql.trim().toUpperCase().startsWith('EXPLAIN')) {
          explainCalled = true;
          return { rows: [{ mock: 'explain' }] };
        }
        // simulate a long-running query
        await sleep(200);
        return { rows: [{ id: 1 }] };
      },
    } as any;

    let threw = false;
    try {
      await runQuery(client, 'SELECT pg_sleep(0.2)', [], { timeoutMs: 50 });
    } catch (err: any) {
      threw = true;
      // Should be a timeout error with message mentioning timeout
      assert.ok(/timeout/i.test(String(err.message)) || err.name === 'QueryTimeoutError');
    }

    assert.ok(threw, 'expected runQuery to throw on timeout');
    assert.ok(explainCalled, 'expected EXPLAIN to be called after timeout');
  }).timeout(5000);
});
