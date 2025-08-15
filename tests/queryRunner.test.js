const { runWithTimeoutRetry } = require('../src/queryRunner');
const { TimeoutError } = require('../src/errors');

jest.setTimeout(10000);

describe('runWithTimeoutRetry', () => {
  test('returns result for fast query', async () => {
    const result = await runWithTimeoutRetry(async ({ signal }) => {
      // ignore signal; immediate result
      return 42;
    });
    expect(result).toBe(42);
  });

  test('retries and finally throws TimeoutError when query respects abort and always times out', async () => {
    let calls = 0;
    const slowQuery = async ({ signal }) => {
      calls++;
      return await new Promise((resolve, reject) => {
        // Simulate a long-running task that respects the signal
        const t = setTimeout(() => resolve('ok'), 1000);
        function onAbort() {
          clearTimeout(t);
          const err = new Error('aborted by signal');
          err.name = 'AbortError';
          reject(err);
        }
        if (signal.aborted) return onAbort();
        signal.addEventListener('abort', onAbort, { once: true });
      });
    };

    await expect(
      runWithTimeoutRetry(slowQuery, { attempts: 3, perAttemptTimeout: 50, backoff: 10, maxBackoff: 20 })
    ).rejects.toThrow(TimeoutError);

    // ensure it attempted multiple times
    expect(calls).toBeGreaterThanOrEqual(3);
  });

  test('succeeds on a later attempt after initial timeouts', async () => {
    let calls = 0;
    const flakyQuery = async ({ signal }) => {
      calls++;
      if (calls < 3) {
        // behave like a long op that respects abort
        return await new Promise((resolve, reject) => {
          const t = setTimeout(() => resolve('late'), 500);
          function onAbort() {
            clearTimeout(t);
            const err = new Error('aborted');
            err.name = 'AbortError';
            reject(err);
          }
          if (signal.aborted) return onAbort();
          signal.addEventListener('abort', onAbort, { once: true });
        });
      }
      // third attempt returns quickly
      return 'success-on-3';
    };

    const res = await runWithTimeoutRetry(flakyQuery, { attempts: 4, perAttemptTimeout: 40, backoff: 10, maxBackoff: 50 });
    expect(res).toBe('success-on-3');
    expect(calls).toBe(3);
  });
});
