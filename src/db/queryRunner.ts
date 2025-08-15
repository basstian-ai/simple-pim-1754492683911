export class TimeoutError extends Error {
  constructor(message = 'Query timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export type RunQueryOptions = Partial<{
  timeoutMs: number; // per-attempt timeout
  retries: number; // number of additional attempts after the first
  backoffMs: number; // initial backoff between attempts
  maxBackoffMs: number; // maximum backoff
  // function that decides if an error should be retried
  retryOn: (err: unknown) => boolean;
  logger: {
    info?: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
  };
  // optional metrics callback for observability
  metrics: (event: { type: 'success' | 'error'; attempt: number; isTimeout?: boolean; error?: any }) => void;
}>;

/**
 * Run a query function with per-attempt timeout, cancellation via AbortSignal and simple retry/backoff.
 *
 * - The provided fn receives an AbortSignal. Implementations should honor the signal to be cancellable.
 * - On timeout the attempt is aborted and, if allowed, retried with exponential backoff.
 * - Observability hooks (logger, metrics) are called as available.
 */
export async function runQuery<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  opts?: RunQueryOptions
): Promise<T> {
  const {
    timeoutMs = 5000,
    retries = 2,
    backoffMs = 100,
    maxBackoffMs = 2000,
    retryOn = (err: unknown) => false,
    logger,
    metrics
  } = opts || {};

  let attempt = 0;
  let backoff = Math.max(0, backoffMs);
  const maxAttempts = Math.max(1, 1 + (retries || 0));

  while (true) {
    attempt += 1;
    const controller = new AbortController();
    let timedOut = false;

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      try {
        controller.abort();
      } catch (e) {
        // some environments may throw when aborting after finished - ignore
      }
    }, timeoutMs);

    try {
      logger?.info?.(`runQuery: attempt=${attempt} timeoutMs=${timeoutMs}`);
      const result = await fn(controller.signal);
      clearTimeout(timeoutHandle);
      metrics?.({ type: 'success', attempt });
      logger?.info?.(`runQuery: success attempt=${attempt}`);
      return result;
    } catch (err) {
      clearTimeout(timeoutHandle);

      // detect timeout-like errors (best-effort): aborted signal or our timedOut flag
      const isAbort = (err && (err as any).name === 'AbortError') || (err && (err as any).message && /(aborted|abort)/i.test((err as any).message));
      const isTimeout = timedOut || err instanceof TimeoutError || isAbort;

      metrics?.({ type: 'error', attempt, isTimeout, error: err });
      logger?.warn?.(`runQuery: attempt=${attempt} failed ${isTimeout ? '(timeout/abort)' : ''} error=${String(err)}`);

      const shouldRetry = attempt < maxAttempts && (isTimeout || retryOn(err));
      if (!shouldRetry) {
        logger?.error?.(`runQuery: giving up after attempt=${attempt}`);
        throw err;
      }

      // wait backoff before retrying
      logger?.info?.(`runQuery: retrying attempt=${attempt + 1} after backoff=${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
      backoff = Math.min(maxBackoffMs, Math.max(1, backoff * 2));
      continue;
    }
  }
}
