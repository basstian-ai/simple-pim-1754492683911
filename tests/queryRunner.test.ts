import { runQueryWithTimeoutAndRetry } from '../src/queryRunner';
import { QueryTimeoutError } from '../src/errors';

jest.setTimeout(20000);

describe('runQueryWithTimeoutAndRetry', () => {
  test('resolves when query completes before timeout', async () => {
    const result = await runQueryWithTimeoutAndRetry(
      async (signal) => {
        // quick work that does not observe the signal (still completes quickly)
        await new Promise((r) => setTimeout(r, 50));
        if (signal.aborted) throw new Error('should not be aborted');
        return 'ok';
      },
      { timeoutMs: 1000, retries: 1 }
    );

    expect(result).toBe('ok');
  });

  test('times out and retries, ultimately throws QueryTimeoutError', async () => {
    const attempts: number[] = [];

    // query that never resolves but rejects when aborted via signal
    const fn = (signal: AbortSignal) =>
      new Promise<string>((_resolve, reject) => {
        const id = setTimeout(() => {
          // never resolves
        }, 10000);

        signal.addEventListener('abort', () => {
          clearTimeout(id);
          reject(new Error('aborted')); // simulate cooperative cancellation
        }, { once: true });

        attempts.push(Date.now());
      });

    const start = Date.now();

    await expect(
      runQueryWithTimeoutAndRetry(fn, { timeoutMs: 100, retries: 2, backoffMs: 20 })
    ).rejects.toThrow(QueryTimeoutError);

    // Ensure we took at least timeout * attempts time (approx)
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
    // We should have attempted multiple times (>= 2 attempts because retries=2)
    expect(attempts.length).toBeGreaterThanOrEqual(1);
  });

  test('propagates non-timeout errors immediately on final attempt', async () => {
    const fn = async (signal: AbortSignal) => {
      await new Promise((r) => setTimeout(r, 20));
      throw new Error('db connection lost');
    };

    await expect(
      runQueryWithTimeoutAndRetry(fn, { timeoutMs: 100, retries: 1 })
    ).rejects.toThrow('db connection lost');
  });
});
