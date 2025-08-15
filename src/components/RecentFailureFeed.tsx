import React from 'react';

export type Failure = {
  id: string;
  channel?: string;
  timestamp?: string;
  message: string;
};

type Props = {
  failures?: Failure[];
  onRefresh?: () => void;
  docsUrl?: string;
};

const containerStyle: React.CSSProperties = {
  borderRadius: 8,
  padding: 20,
  background: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

const emptyStateStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 28,
  color: '#333',
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
};

const hintStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#555',
  textAlign: 'center',
  maxWidth: 520,
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#f7f7f8',
  cursor: 'pointer',
};

export default function RecentFailureFeed({
  failures = [],
  onRefresh,
  docsUrl = '/docs/publish-health',
}: Props) {
  const isEmpty = failures.length === 0;

  if (isEmpty) {
    return (
      <div style={containerStyle} role="region" aria-label="Recent Failure Feed">
        <div style={emptyStateStyle}>
          <div aria-hidden style={{ fontSize: 40 }}>
            ✅
          </div>
          <div style={titleStyle}>All clear — no recent failures</div>
          <div style={hintStyle}>
            There are currently no recent publish failures. If you're expecting activity, try refreshing or
            check the Publish Health documentation for troubleshooting tips and next steps.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => onRefresh && onRefresh()}
              aria-label="Refresh failures"
            >
              Refresh
            </button>

            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              aria-label="Open Publish Health docs"
            >
              <button type="button" style={buttonStyle}>View Publish Health docs</button>
            </a>
          </div>

          <ul style={{ marginTop: 12, color: '#666', fontSize: 13, textAlign: 'left' }}>
            <li>Check channel credentials and recent job logs.</li>
            <li>Confirm payloads are valid for the target channel.</li>
            <li>Search the Recent Failure Feed for job IDs or product IDs.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} role="region" aria-label="Recent Failure Feed">
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {failures.map((f) => (
          <li
            key={f.id}
            style={{ padding: 12, borderRadius: 6, border: '1px solid #f0f0f0', background: '#fff' }}
            data-testid={`failure-item-${f.id}`}
          >
            <div style={{ fontWeight: 600 }}>{f.channel ?? 'Unknown channel'}</div>
            <div style={{ color: '#444', marginTop: 6 }}>{f.message}</div>
            {f.timestamp && <div style={{ color: '#888', marginTop: 6, fontSize: 12 }}>{f.timestamp}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
