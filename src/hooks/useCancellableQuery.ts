import { useCallback, useRef, useState } from 'react';

export type QueryStatus = 'idle' | 'running' | 'success' | 'error' | 'timeout';

// Lightweight cancellable query hook for wiring the UI. The real app may have
// a more sophisticated implementation (timeouts, retries, telemetry). This
// file intentionally keeps behavior minimal so views/components can interact
// with a predictable contract for tests and early integration.
export function useCancellableQuery<T = any>() {
  const controllerRef = useRef<{ cancelled: boolean } | null>(null);
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const run = useCallback(async (fn?: () => Promise<T>, opts?: { timeoutMs?: number }) => {
    controllerRef.current = { cancelled: false };
    setStatus('running');
    setError(null);
    setIsTimedOut(false);

    const timeoutMs = opts?.timeoutMs ?? 5000;

    let didTimeout = false;
    const to = setTimeout(() => {
      didTimeout = true;
      setIsTimedOut(true);
      setStatus('timeout');
    }, timeoutMs);

    try {
      if (!fn) {
        // no-op query: resolve immediately
        clearTimeout(to);
        setData(null);
        setStatus('success');
        return null as unknown as T;
      }

      const result = await Promise.race([
        fn(),
        new Promise<T>((_res, _rej) => {
          // this promise never resolves; timeout above will set status
        }),
      ] as any);

      clearTimeout(to);
      if (controllerRef.current?.cancelled) {
        // cancelled; keep state as-is but mark idle
        setStatus('idle');
        return null as unknown as T;
      }

      if (didTimeout) {
        // already timed out; disregard this result
        return result;
      }

      setData(result as T);
      setStatus('success');
      return result;
    } catch (err) {
      clearTimeout(to);
      if (controllerRef.current?.cancelled) {
        setStatus('idle');
        return null as unknown as T;
      }
      setError(err);
      setStatus('error');
      throw err;
    }
  }, []);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.cancelled = true;
      setStatus('idle');
      setIsTimedOut(false);
    }
  }, []);

  const retry = useCallback((fn?: () => Promise<T>, opts?: { timeoutMs?: number }) => {
    setIsTimedOut(false);
    return run(fn, opts);
  }, [run]);

  return {
    status,
    data,
    error,
    isTimedOut,
    run,
    cancel,
    retry,
  } as const;
}

export default useCancellableQuery;
