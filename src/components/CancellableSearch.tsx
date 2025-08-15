import React, { useState } from 'react';
import useCancellableQuery, { QueryFetcher } from '../hooks/useCancellableQuery';

// A small presentational component that wires up the cancellable hook to a simple UI.
// The component accepts an optional fetcher prop for integration; if not provided it uses a demo fetcher.

type Props<T> = {
  placeholder?: string;
  fetcher?: QueryFetcher<T>;
  renderResult?: (result: T | null) => React.ReactNode;
};

function demoFetcher(query: string, signal: AbortSignal, onProgress?: (p: number) => void) {
  // demo fetcher that emits progress over time and resolves with a simple payload
  return new Promise<{ query: string; timestamp: number }>((resolve, reject) => {
    let progress = 0;
    const ticks = 5;
    const interval = 200;
    const id = window.setInterval(() => {
      if (signal.aborted) {
        clearInterval(id);
        const e = new Error('aborted');
        (e as any).name = 'AbortError';
        reject(e);
        return;
      }
      progress += 1 / ticks;
      if (onProgress) onProgress(progress);
      if (progress >= 1) {
        clearInterval(id);
        resolve({ query, timestamp: Date.now() });
      }
    }, interval);

    signal.addEventListener('abort', () => {
      clearInterval(id);
      const e = new Error('aborted');
      (e as any).name = 'AbortError';
      reject(e);
    });
  });
}

export default function CancellableSearch<T = { query: string; timestamp: number }>(props: Props<T>) {
  const { placeholder = 'Search…', fetcher = demoFetcher as unknown as QueryFetcher<T>, renderResult } = props;
  const [q, setQ] = useState('');
  const { data, loading, progress, error, start, cancel, getLastResult } = useCancellableQuery<T>(fetcher, { timeoutMs: 10000 });

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await start(q);
    } catch (err) {
      // error state handled by hook; swallow here
    }
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', padding: 12, borderRadius: 6, maxWidth: 640 }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          aria-label="search-input"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading || q.trim() === ''} aria-disabled={loading || q.trim() === ''}>
          Search
        </button>
        <button type="button" onClick={() => cancel()} disabled={!loading} aria-disabled={!loading}>
          Cancel
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        {loading && (
          <div>
            <div aria-live="polite">Searching…</div>
            <div style={{ height: 8, background: '#f3f3f3', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={progress ?? 0}
                style={{ width: `${(progress ?? 0) * 100}%`, height: '100%', background: '#3b82f6' }}
              />
            </div>
          </div>
        )}

        {!loading && error && (
          <div style={{ marginTop: 8, color: '#b91c1c' }}>
            <strong>Error:</strong> {error.message ?? String(error)}
            <div style={{ marginTop: 8 }}>
              {getLastResult() ? (
                <button type="button" onClick={() => {
                  // noop: consumer could call getLastResult() to render; here we just hint
                  // In a real app we'd wire telemetry/UI to surface the last result automatically
                }}>
                  Show last successful result
                </button>
              ) : (
                <span style={{ marginLeft: 8, color: '#6b7280' }}>No previous results available.</span>
              )}
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <div style={{ marginTop: 12 }}>
            {renderResult ? renderResult(data) : <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}
          </div>
        )}

        {!loading && !error && !data && (
          <div style={{ marginTop: 12, color: '#6b7280' }}>No results yet. Run a search above.</div>
        )}
      </div>
    </div>
  );
}
