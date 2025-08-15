import React, { useEffect, useMemo, useState } from 'react';
import { loadFilters, saveFilters, RecentFailureFeedSavedFilters } from '../utils/persistence';

export type TimeWindow = '24h' | '7d' | '30d';

export type RecentFailureFeedFilters = {
  channels: string[];
  envs: string[];
  timeWindow: TimeWindow;
};

export type RecentFailureFeedProps = {
  // Available options to render in the filter UI
  availableChannels: string[];
  availableEnvs: string[];
  // Called when filters are applied / changed
  onApply?: (filters: RecentFailureFeedFilters) => void;
  // Optional key to separate persisted scopes (defaults to 'recentFailureFeed')
  persistenceKey?: string;
};

const DEFAULT: RecentFailureFeedFilters = {
  channels: [],
  envs: [],
  timeWindow: '24h',
};

export const RecentFailureFeed: React.FC<RecentFailureFeedProps> = ({
  availableChannels,
  availableEnvs,
  onApply,
  persistenceKey = 'recentFailureFeed',
}) => {
  // load persisted filters (if any) and merge with defaults
  const saved = useMemo(() => loadFilters(persistenceKey), [persistenceKey]);
  const [filters, setFilters] = useState<RecentFailureFeedFilters>(() => ({ ...DEFAULT, ...(saved ?? {}) }));

  // Persist whenever filters change so investigators get fast state restore
  useEffect(() => {
    saveFilters(persistenceKey, filters);
  }, [filters, persistenceKey]);

  // helper toggles
  const toggleChannel = (ch: string) => {
    setFilters((prev) => {
      const has = prev.channels.includes(ch);
      return { ...prev, channels: has ? prev.channels.filter((c) => c !== ch) : [...prev.channels, ch] };
    });
  };

  const toggleEnv = (e: string) => {
    setFilters((prev) => {
      const has = prev.envs.includes(e);
      return { ...prev, envs: has ? prev.envs.filter((x) => x !== e) : [...prev.envs, e] };
    });
  };

  const setTimeWindow = (w: TimeWindow) => setFilters((p) => ({ ...p, timeWindow: w }));

  const apply = () => {
    onApply?.(filters);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6, maxWidth: 560 }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Recent Failure Feed — Filters</h3>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Channels</div>
        <div data-testid="channels-list">
          {availableChannels.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No channels available</div>
          ) : (
            availableChannels.map((ch) => (
              <label key={ch} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12 }}>
                <input
                  data-testid={`channel-${ch}`}
                  type="checkbox"
                  checked={filters.channels.includes(ch)}
                  onChange={() => toggleChannel(ch)}
                />
                <span style={{ marginLeft: 6 }}>{ch}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Environments</div>
        <div data-testid="envs-list">
          {availableEnvs.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No environments available</div>
          ) : (
            availableEnvs.map((e) => (
              <label key={e} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12 }}>
                <input
                  data-testid={`env-${e}`}
                  type="checkbox"
                  checked={filters.envs.includes(e)}
                  onChange={() => toggleEnv(e)}
                />
                <span style={{ marginLeft: 6 }}>{e}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Time window</div>
        <div>
          {(['24h', '7d', '30d'] as TimeWindow[]).map((w) => (
            <button
              key={w}
              data-testid={`tw-${w}`}
              onClick={() => setTimeWindow(w)}
              style={{
                marginRight: 8,
                padding: '6px 10px',
                borderRadius: 4,
                border: filters.timeWindow === w ? '1px solid #2563eb' : '1px solid #d1d5db',
                background: filters.timeWindow === w ? '#e0f2ff' : 'white',
                cursor: 'pointer',
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button data-testid="apply" onClick={apply} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Apply
        </button>
        <button
          data-testid="clear"
          onClick={() => setFilters(DEFAULT)}
          style={{ padding: '8px 12px', cursor: 'pointer', background: '#f3f4f6' }}
        >
          Clear
        </button>
      </div>

      <div style={{ marginTop: 12, color: '#6b7280', fontSize: 12 }} data-testid="summary">
        Selected: {filters.channels.length} channel(s), {filters.envs.length} env(s), last {filters.timeWindow}
      </div>
    </div>
  );
};

export default RecentFailureFeed;
