import React, { useEffect, useState } from 'react';
import useCancellableQuery from '../hooks/useCancellableQuery';
import QueryTimeoutBanner from '../components/QueryTimeoutBanner';

export const ReportsView: React.FC = () => {
  const { status, data, error, isTimedOut, run, retry, cancel } = useCancellableQuery<any>();
  const [filters, setFilters] = useState({ channel: 'all', period: '30d' });

  const makeReportFn = (f: any) => async () => {
    // artificial work
    await new Promise((r) => setTimeout(r, 150));
    return { report: { totals: 0 }, filters: f };
  };

  useEffect(() => {
    run(makeReportFn(filters), { timeoutMs: 2000 }).catch(() => {});
  }, [filters]);

  const handleRetry = () => {
    retry(makeReportFn(filters), { timeoutMs: 2000 }).catch(() => {});
  };

  const handleNarrow = () => {
    // suggestion: narrow by period
    const narrower = { ...filters, period: '7d' };
    setFilters(narrower);
    run(makeReportFn(narrower), { timeoutMs: 2000 }).catch(() => {});
  };

  const handleCancel = () => cancel();

  return (
    <div>
      <h2>Reports</h2>

      <div style={{ marginTop: 12 }}>
        <QueryTimeoutBanner
          visible={isTimedOut || status === 'timeout'}
          onRetry={handleRetry}
          onNarrow={handleNarrow}
          onCancel={handleCancel}
          message="The report query exceeded the expected time."
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Status:</strong> {status}
        {error ? <div style={{ color: 'red' }}>Error: {String(error)}</div> : null}
        <pre aria-label="report-result">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ReportsView;
