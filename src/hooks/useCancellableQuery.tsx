import { useCallback, useRef, useState } from 'react';

export type QueryFetcher<T> = (
  query: string,
  signal: AbortSignal,
  onProgress?: (progress: number) => void
) => Promise<T>;

export type UseCancellableQueryOptions = {
  timeoutMs?: number; // optional client-side timeout
};

export default function useCancellableQuery<T>(
  fetcher: QueryFetcher<T>,
  opts: UseCancellableQueryOptions = {}
) {
  const { timeoutMs = 10000 } = opts;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);

  // store the last successful result so it can be surfaced on cancel/timeout
  const lastResultRef = useRef<T | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const cancel = useCallback((reason?: string) => {
    setLoading(false);
    setProgress(null);
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {
        // no-op
      }
      abortRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setError({ name: 'canceled', message: reason ?? 'Canceled by user' });
  }, []);

  const start = useCallback(
    async (query: string) => {
      // Cancel any in-flight request first
      if (abortRef.current) {
        cancel('New request started');
      }

      setError(null);
      setLoading(true);
      setProgress(0);

      const controller = new AbortController();
      abortRef.current = controller;

      // client-side timeout
      if (timeoutMs > 0) {
        timeoutRef.current = window.setTimeout(() => {
          // only abort if still running
          if (abortRef.current) {
            try {
              abortRef.current.abort();
            } catch (e) {}
            abortRef.current = null;
            setLoading(false);
            setProgress(null);
            setError({ name: 'timeout', message: `Request timed out after ${timeoutMs}ms` });
          }
        }, timeoutMs);
      }

      try {
        const result = await fetcher(query, controller.signal, p => {
          // normalize progress to 0..1
          setProgress(Math.max(0, Math.min(1, p)));
        });

        setData(result);
        lastResultRef.current = result;
        setError(null);
        setProgress(1);
        setLoading(false);

        // clear timeout if set
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // clear abort controller
        abortRef.current = null;

        return result;
      } catch (err: any) {
        // distinguish aborts
        const isAbort = err && (err.name === 'AbortError' || err.name === 'CanceledError');
        if (isAbort) {
          // expected cancellation
          setError({ name: 'canceled', message: err.message ?? 'Request canceled' });
        } else {
          setError(err);
        }
        setLoading(false);
        setProgress(null);

        // clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        abortRef.current = null;
        // rethrow so callers can await start() and handle
        throw err;
      }
    },
    [fetcher, timeoutMs, cancel]
  );

  const getLastResult = useCallback(() => lastResultRef.current, []);

  return {
    data,
    loading,
    progress,
    error,
    start,
    cancel,
    getLastResult
  } as const;
}
