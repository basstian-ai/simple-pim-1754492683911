import React from 'react';
import { RetryMetric } from './types';

type Props = {
  metrics: RetryMetric[];
  // optional base URL for job drill-downs (defaults to /jobs/)
  jobBasePath?: string;
};

function percent(n: number, denom: number) {
  if (denom === 0) return '0%';
  return `${Math.round((n / denom) * 100)}%`;
}

/**
 * RetryMetricsPanel
 *
 * Minimal, accessible presentation of retry metrics for the Publish Health dashboard.
 * - Shows total retries (bar + number)
 * - Shows success-after-retry rate (percentage)
 * - Shows max attempts
 * - Provides a link to a sample job drill-down when available
 *
 * This component intentionally avoids pulling in charting dependencies. It is
 * easy to swap for a richer chart (e.g. recharts, chart.js) later.
 */
export default function RetryMetricsPanel({ metrics, jobBasePath = '/jobs/' }: Props) {
  const maxTotalRetries = metrics.reduce((max, m) => Math.max(max, m.totalRetries), 0) || 1;

  return (
    <section aria-labelledby="retry-metrics-heading">
      <h2 id="retry-metrics-heading">Retry metrics</h2>
      <p className="sr-only">Shows retry count, success-after-retry rate and max attempts by channel.</p>

      <div role="table" aria-label="Retry metrics by channel">
        <div role="rowgroup">
          <div role="row" style={{ display: 'flex', fontWeight: 600, gap: 16 }}>
            <div role="columnheader" style={{ width: 200 }}>Channel</div>
            <div role="columnheader" style={{ flex: 1 }}>Total retries</div>
            <div role="columnheader" style={{ width: 140 }}>Success after retry</div>
            <div role="columnheader" style={{ width: 120 }}>Max attempts</div>
            <div role="columnheader" style={{ width: 160 }}>Drill</div>
          </div>
        </div>

        <div role="rowgroup">
          {metrics.map((m) => (
            <div
              key={m.channel}
              role="row"
              aria-rowindex={metrics.indexOf(m) + 2}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 0',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <div role="cell" style={{ width: 200 }}>{m.channel}</div>

              <div role="cell" style={{ flex: 1 }}>
                <div aria-hidden style={{ background: '#f1f5f9', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                  <div
                    data-testid={`bar-${m.channel}`}
                    style={{
                      width: `${(m.totalRetries / maxTotalRetries) * 100}%`,
                      background: '#2563eb',
                      height: '100%'
                    }}
                  />
                </div>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  <strong>{m.totalRetries}</strong> retries
                </div>
              </div>

              <div role="cell" style={{ width: 140 }}>{percent(m.successAfterRetry, m.totalRetries)}</div>

              <div role="cell" style={{ width: 120 }}>{m.maxAttempts}</div>

              <div role="cell" style={{ width: 160 }}>
                {m.sampleJobIds && m.sampleJobIds.length > 0 ? (
                  <a
                    href={`${jobBasePath}${encodeURIComponent(m.sampleJobIds[0])}`}
                    aria-label={`Open job ${m.sampleJobIds[0]} for ${m.channel}`}
                    data-testid={`drill-${m.channel}`}
                  >
                    Open job
                  </a>
                ) : (
                  <span style={{ color: 'rgba(0,0,0,0.45)' }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
