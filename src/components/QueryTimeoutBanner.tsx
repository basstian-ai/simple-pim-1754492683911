import React from 'react';

export type QueryTimeoutBannerProps = {
  // elapsed query duration in milliseconds
  durationMs: number;
  // configured duration limit in milliseconds (0 or undefined disables banner)
  limitMs?: number;
  // optional docs link for deeper guidance
  docsUrl?: string;
  // optional click handler for a diagnostics/optimize action
  onOptimizeClick?: () => void;
};

// Show the banner when the query is >= 75% of the limit or has exceeded it.
function shouldShowBanner(durationMs: number, limitMs?: number) {
  if (!limitMs || limitMs <= 0) return false;
  const ratio = durationMs / limitMs;
  return ratio >= 0.75 || durationMs >= limitMs;
}

export default function QueryTimeoutBanner({
  durationMs,
  limitMs,
  docsUrl = '/docs/query-duration-limits',
  onOptimizeClick,
}: QueryTimeoutBannerProps) {
  const show = shouldShowBanner(durationMs, limitMs);
  if (!show) return null;

  const exceeded = !!limitMs && durationMs >= limitMs;
  const seconds = (ms: number) => (ms / 1000).toFixed(1);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '12px',
        borderRadius: 6,
        background: exceeded ? '#FFF1F0' : '#FFF8E1',
        color: '#1f2937',
        border: exceeded ? '1px solid #F87171' : '1px solid #FBBF24',
        fontSize: 14,
      }}
    >
      <div aria-hidden style={{ fontSize: 20, lineHeight: 1 }}>
        {exceeded ? '⛔' : '⚠️'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          {exceeded ? 'Query duration limit reached' : 'Query approaching duration limit'}
        </div>
        <div style={{ marginBottom: 8, color: '#374151' }}>
          {limitMs
            ? `This query has been running for ${seconds(durationMs)}s of the ${seconds(
                limitMs,
              )}s limit. ${
                exceeded
                  ? 'It may fail or be cancelled; consider optimizing.'
                  : 'Long queries can hit limits and cause failures.'
              }`
            : 'This query is running longer than usual.'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '6px 10px',
              background: '#111827',
              color: '#ffffff',
              borderRadius: 4,
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Quick optimization tips
          </a>
          <button
            onClick={onOptimizeClick}
            style={{
              padding: '6px 10px',
              background: '#E5E7EB',
              color: '#111827',
              borderRadius: 4,
              border: 'none',
              cursor: onOptimizeClick ? 'pointer' : 'default',
              fontSize: 13,
            }}
            disabled={!onOptimizeClick}
            aria-disabled={!onOptimizeClick}
          >
            Run diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
