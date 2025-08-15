import React, { useEffect, useState } from 'react';
import useCancellableQuery from '../hooks/useCancellableQuery';
import QueryTimeoutBanner from '../components/QueryTimeoutBanner';

export const SearchView: React.FC = () => {
  const { status, data, error, isTimedOut, run, retry, cancel } = useCancellableQuery<any>();
  const [query, setQuery] = useState('');
  const [timeRange, setTimeRange] = useState('last_30_days');

  // example query function - in real app this would call an API
  const makeQueryFn = (q: string, range: string) => async () => {
    // simulate network latency - the hook timeout will determine whether
    // we consider it a timeout in this demo wiring.
    await new Promise((r) => setTimeout(r, 100));
    return { items: [], q, range };
  };

  useEffect(() => {
    // run the query when search params change
    run(makeQueryFn(query, timeRange), { timeoutMs: 2000 }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, timeRange]);

  const handleRetry = () => {
    retry(makeQueryFn(query, timeRange), { timeoutMs: 2000 }).catch(() => {});
  };

  const handleNarrow = () => {
    // heuristic: narrow time range when user chooses to narrow
    const narrower = timeRange === 'last_30_days' ? 'last_7_days' : 'last_7_days';
    setTimeRange(narrower);
    // run will be triggered by useEffect because timeRange changes, but we call explicitly
    run(makeQueryFn(query, narrower), { timeoutMs: 2000 }).catch(() => {});
  };

  const handleCancel = () => {
    cancel();
  };

  return (
    <div>
      <h2>Search</h2>
      <input
        aria-label="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      <div style={{ marginTop: 12 }}>
        <QueryTimeoutBanner
          visible={isTimedOut || status === 'timeout'}
          onRetry={handleRetry}
          onNarrow={handleNarrow}
          onCancel={handleCancel}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Status:</strong> {status}
        {error ? <div style={{ color: 'red' }}>Error: {String(error)}</div> : null}
        <pre aria-label="search-result">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SearchView;
