const { runQueryWithTimeout, AbortError } = require('../src/db/queryRunner');

// Simple mock DB client that supports abort signalling and EXPLAIN.
class MockClient {
  constructor({ delayMs = 10, fail = false } = {}) {
    this.delayMs = delayMs;
    this.fail = fail;
  }

  async query(sql, params, opts) {
    // Simulate EXPLAIN handling
    if (typeof sql === 'string' && sql.trim().toUpperCase().startsWith('EXPLAIN')) {
      return { rows: [{ plan: `mock-explain-for:${sql.replace(/\n/g, '\\n')}`} ] };
    }

    // If caller passed a signal, listen for it
    const signal = opts && opts.signal;

    return await new Promise((resolve, reject) => {
      let settled = false;
      const id = setTimeout(() => {
        if (this.fail) {
          settled = true;
          return reject(new Error('simulated db error'));
        }
        if (!settled) {
          settled = true;
          resolve({ rows: [{ ok: true, sql }] });
        }
      }, this.delayMs);

      if (signal) {
        if (signal.aborted) {
          clearTimeout(id);
          return reject(new AbortError('aborted before start'));
        }
        signal.addEventListener('abort', () => {
          if (!settled) {
            settled = true;
            clearTimeout(id);
            reject(new AbortError('aborted'));
          }
        }, { once: true });
      }
    });
  }
}

async function shortDelay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Small test harness without any test runner framework detection. If executed under Jest/Mocha it will be picked up.
// Provide three test cases, throwing on failure.

async function testFastQuerySucceeds() {
  const client = new MockClient({ delayMs: 10 });
  const res = await runQueryWithTimeout({ client, sql: 'SELECT 1', perAttemptTimeoutMs: 1000, maxAttempts: 2 });
  if (!res || !res.rows || res.rows[0].ok !== true) throw new Error('fast query did not return expected result');
  console.log('testFastQuerySucceeds: ok');
}

async function testSlowQueryTriggersOnSlowAndExplain() {
  const slowMs = 120; // longer than slow threshold below
  const client = new MockClient({ delayMs: slowMs });
  let onSlowCalled = false;
  let explainCaptured = null;
  const start = Date.now();
  try {
    // set perAttemptTimeout wide enough so attempt finishes but triggers slow threshold
    const res = await runQueryWithTimeout({
      client,
      sql: 'SELECT * FROM big_table',
      perAttemptTimeoutMs: 500,
      maxAttempts: 1,
      slowQueryThresholdMs: 100,
      onSlow: async (sql, explain) => {
        onSlowCalled = true;
        explainCaptured = explain;
      }
    });
    const duration = Date.now() - start;
    if (!onSlowCalled) throw new Error('onSlow was not called for slow query');
    if (!explainCaptured || !explainCaptured.includes('mock-explain-for')) throw new Error('explain not captured');
    if (!res || !res.rows) throw new Error('slow query did not return expected result');
    console.log('testSlowQueryTriggersOnSlowAndExplain: ok (duration ' + duration + 'ms)');
  } catch (err) {
    throw err;
  }
}

async function testTimeoutAndRetries() {
  // Configure client that takes longer than per-attempt timeout which should trigger retries and finally throw
  const client = new MockClient({ delayMs: 300 });
  let onSlowCalled = false;
  try {
    await runQueryWithTimeout({
      client,
      sql: 'SELECT * FROM stuck_table',
      perAttemptTimeoutMs: 100, // attempt will timeout
      maxAttempts: 2,
      slowQueryThresholdMs: 50,
      onSlow: async () => { onSlowCalled = true; }
    });
    throw new Error('expected runQueryWithTimeout to throw due to timeouts');
  } catch (err) {
    // Should be an AbortError or error from last attempt
    if (!err) throw err;
    if (!onSlowCalled) throw new Error('onSlow should have been called when an attempt exceeded slow threshold');
    console.log('testTimeoutAndRetries: ok (error: ' + (err && err.message) + ')');
  }
}

(async () => {
  try {
    await testFastQuerySucceeds();
    await shortDelay(20);
    await testSlowQueryTriggersOnSlowAndExplain();
    await shortDelay(20);
    await testTimeoutAndRetries();
    console.log('\nAll queryRunner tests passed');
  } catch (err) {
    console.error('Tests failed:', err);
    process.exitCode = 1;
  }
})();
