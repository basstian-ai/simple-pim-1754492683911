import { runQuery, TimeoutError } from '../queryRunner';

// Simple helper that returns a promise that resolves after `delayMs`.
// It respects AbortSignal: if aborted before completion it rejects with an Error whose message includes 'aborted'.
function delayed<T>(delayMs: number, value: T, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => {
      resolve(value);
    }, delayMs);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(id);
        return reject(new Error('aborted'));
      }
      const onAbort = () => {
        clearTimeout(id);
        reject(new Error('aborted'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

describe('runQuery', () => {
  jest.setTimeout(10000);

  test('returns result when function completes before timeout', async () => {
    const res = await runQuery(() => delayed(20, 'ok'), { timeoutMs: 200, retries: 0 });
    expect(res).toBe('ok');
  });

  test('retries on timeout and eventually succeeds', async () => {
    let calls = 0;
    // First call will be slow (100ms), second will be fast (10ms)
    const result = await runQuery(
      (signal) => {
        calls += 1;
        if (calls === 1) return delayed(100, 'first', signal);
        return delayed(10, 'second', signal);
      },
      { timeoutMs: 50, retries: 2, backoffMs: 20 }
    );

    expect(result).toBe('second');
    expect(calls).toBeGreaterThanOrEqual(2);
  });

  test('fails after exhausting retries', async () => {
    // Always slow; should timeout every attempt and eventually reject
    await expect(
      runQuery(
        (signal) => delayed(120, 'never', signal),
        { timeoutMs: 30, retries: 1, backoffMs: 10 }
      )
    ).rejects.toThrow(/aborted|timed out/i);
  });

  test('honors retryOn for transient non-timeout errors', async () => {
    let tries = 0;
    const result = await runQuery(
      async (signal) => {
        tries += 1;
        if (tries === 1) {
          // simulate a transient server error
          const err: any = new Error('ECONNRESET');
          err.code = 'ECONNRESET';
          throw err;
        }
        return 'ok-after-retry';
      },
      {
        timeoutMs: 50,
        retries: 2,
        retryOn: (err) => {
          // retry on any error with code ECONNRESET
          return !!(err && (err as any).code === 'ECONNRESET');
        }
      }
    );

    expect(result).toBe('ok-after-retry');
    expect(tries).toBeGreaterThanOrEqual(2);
  });
});
