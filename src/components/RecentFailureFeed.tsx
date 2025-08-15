import React, { useEffect, useRef, useState } from 'react';

type FilterState = Record<string, any>;

type Item = {
  id: string;
  title: string;
};

type Props = {
  items: Item[];
  initialFilters?: FilterState;
  // Called when the user drills into a job. Consumers should perform navigation.
  // RecentFailureFeed will save scroll+filter state before calling this.
  onNavigate?: (jobId: string) => void;
};

// Key used to store feed state inside history.state for the current pathname.
const feedStateKeyForPath = (path: string) => `${path}::recentFailureFeed:v1`;

export const RecentFailureFeed: React.FC<Props> = ({
  items,
  initialFilters = {},
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const stateKey = feedStateKeyForPath(pathname);

  // On mount, attempt to restore filters + scroll from history.state if present.
  useEffect(() => {
    try {
      const hs = window.history.state || {};
      const saved = hs[stateKey];
      if (saved) {
        if (saved.filters) setFilters(saved.filters);
        // restore scroll after paint
        requestAnimationFrame(() => {
          if (containerRef.current && typeof saved.scrollTop === 'number') {
            containerRef.current.scrollTop = saved.scrollTop;
          }
        });
      }
    } catch (e) {
      // be resilient; don't block render if history.state access fails
      // eslint-disable-next-line no-console
      console.warn('Could not restore RecentFailureFeed state', e);
    }
    // ensure there's an entry so consumers can update/replace later
    try {
      const hs = window.history.state || {};
      if (!hs[stateKey]) {
        const copy = Object.assign({}, hs, { [stateKey]: { filters: initialFilters, scrollTop: 0 } });
        window.history.replaceState(copy, document.title);
      }
    } catch (e) {
      // noop
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save handler used before navigation to job details.
  const saveState = () => {
    try {
      const scrollTop = containerRef.current ? containerRef.current.scrollTop : 0;
      const hs = window.history.state || {};
      const copy = Object.assign({}, hs, { [stateKey]: { filters, scrollTop } });
      // use replaceState so we don't create extra history entries — user expects back to go back to where they were
      window.history.replaceState(copy, document.title);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not save RecentFailureFeed state', e);
    }
  };

  const handleDrill = (jobId: string) => {
    saveState();
    if (onNavigate) {
      onNavigate(jobId);
    } else {
      // default: navigate by setting location.href — this will unload the page
      window.location.href = `/jobs/${jobId}`;
    }
  };

  // Example filter change that updates internal filters state.
  // Consumers will likely wire to real filter controls; exposing here for completeness.
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Immediately persist to history state so browser back/forward preserves changes
      try {
        const hs = window.history.state || {};
        const scrollTop = containerRef.current ? containerRef.current.scrollTop : 0;
        const copy = Object.assign({}, hs, { [stateKey]: { filters: next, scrollTop } });
        window.history.replaceState(copy, document.title);
      } catch (e) {
        // noop
      }
      return next;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        {/* Minimal filter UI for example/testing purposes */}
        <label>
          Search:
          <input
            aria-label="feed-search"
            value={String(filters.search || '')}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </label>
      </div>

      <div
        ref={containerRef}
        data-testid="feed-container"
        style={{ height: 200, overflowY: 'auto', border: '1px solid #ddd', padding: 8 }}
      >
        {items.length === 0 && <div data-testid="empty">No recent failures</div>}
        {items.map((it) => (
          <div
            key={it.id}
            style={{ padding: 8, borderBottom: '1px solid #eee', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onClick={() => handleDrill(it.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleDrill(it.id);
            }}
            data-testid={`job-${it.id}`}
          >
            <strong>{it.title}</strong>
            <div style={{ color: '#666', fontSize: 12 }}>Job ID: {it.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFailureFeed;
