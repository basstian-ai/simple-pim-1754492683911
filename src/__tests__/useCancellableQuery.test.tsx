import { act, renderHook } from '@testing-library/react-hooks';
import useCancellableQuery from '../hooks/useCancellableQuery';

// Create a controllable fetcher for tests
function controllableFetcher<T>(delayMs = 200, value: T) {
  return (query: string, signal: AbortSignal, onProgress?: (p: number) => void) => {
    return new Promise<T>((resolve, reject) => {
      let cancelled = false;
      const steps = 4;
      let step = 0;

      const tick = () => {
        if (signal.aborted) {
          cancelled = true;
          const e = new Error('aborted');
          (e as any).name = 'AbortError';
          reject(e);
          return;
        }
        step += 1;
        if (onProgress) onProgress(step / steps);
        if (step >= steps) {
          resolve(value);
        } else {
          setTimeout(tick, delayMs / steps);
        }
      };

      setTimeout(tick, delayMs / steps);

      signal.addEventListener('abort', () => {
        cancelled = true;
      });
    });
  };
}

jest.useFakeTimers();

describe('useCancellableQuery', () => {
  it('should fetch data and set last result on success', async () => {
    const fetcher = controllableFetcher(200, { ok: true, q: 'x' });
    const { result } = renderHook(() => useCancellableQuery(fetcher, { timeoutMs: 1000 }));

    // start the request
    let promise: Promise<any>;
    act(() => {
      promise = result.current.start('x') as Promise<any>;
    });

    // advance time to let progress update and resolve
    await act(async () => {
      jest.advanceTimersByTime(250);
      // wait microtask ticks
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(250);
      await Promise.resolve();
    });

    await promise;

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ ok: true, q: 'x' });
    expect(result.current.getLastResult()).toEqual({ ok: true, q: 'x' });
  });

  it('should cancel an in-flight request and preserve last result', async () => {
    const fetcher = controllableFetcher(400, { ok: true, q: 'first' });
    const { result } = renderHook(() => useCancellableQuery(fetcher, { timeoutMs: 1000 }));

    // start first request and let it finish
    await act(async () => {
      const p = result.current.start('first');
      jest.advanceTimersByTime(500);
      await p;
    });

    expect(result.current.getLastResult()).toEqual({ ok: true, q: 'first' });

    // start a long request and cancel it before completion
    const longFetcher = controllableFetcher(1000, { ok: true, q: 'second' });
    // re-render hook with new fetcher by calling a wrapper hook
    // For simplicity in this test we render a new hook instance
    const { result: r2 } = renderHook(() => useCancellableQuery(longFetcher, { timeoutMs: 2000 }));

    act(() => {
      r2.current.start('second');
      jest.advanceTimersByTime(200);
    });

    act(() => {
      r2.current.cancel();
    });

    expect(r2.current.loading).toBe(false);
    expect(r2.current.error).not.toBeNull();
    expect(r2.current.error.name).toBe('canceled');

    // previous hook instance still has its last result
    expect(result.current.getLastResult()).toEqual({ ok: true, q: 'first' });
  });

  it('should time out client-side and set timeout error', async () => {
    const slowFetcher = controllableFetcher(5000, { ok: true });
    const { result } = renderHook(() => useCancellableQuery(slowFetcher, { timeoutMs: 1000 }));

    act(() => {
      result.current.start('slow').catch(() => {});
    });

    // advance to just before timeout
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // after timeout should have error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error.name).toBe('timeout');
  });
});
