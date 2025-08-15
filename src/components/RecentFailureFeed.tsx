import React from 'react';
import { Link } from 'react-router-dom';
import { buildJobDetailPath } from '../utils/deeplink';

export type FailureItem = {
  jobId: string;
  runId?: string | number;
  errorId?: string | number;
  title: string;
  occurredAt?: string; // ISO
};

export type RecentFailureFeedProps = {
  failures: FailureItem[];
  // any filters currently applied to the feed which should be preserved when navigating
  feedFilters?: Record<string, unknown>;
  // optional aria-label for the list container
  ariaLabel?: string;
};

export const RecentFailureFeed: React.FC<RecentFailureFeedProps> = ({ failures, feedFilters, ariaLabel = 'Recent failure feed' }) => {
  if (!failures || failures.length === 0) {
    return <div aria-label={ariaLabel}>No recent failures</div>;
  }

  return (
    <ul aria-label={ariaLabel} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {failures.map((f) => {
        const to = buildJobDetailPath({ jobId: f.jobId, runId: f.runId, errorId: f.errorId, feedFilters });
        return (
          <li key={`${f.jobId}-${String(f.runId ?? '')}-${String(f.errorId ?? '')}`} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <Link to={to} data-testid={`failure-link-${f.jobId}-${f.runId ?? 'na'}`}> 
              <div style={{ fontWeight: 600 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{f.occuredAt ?? f.occurredAt ?? ''}</div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default RecentFailureFeed;
