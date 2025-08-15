import { useEffect, useRef } from 'react';
import { FailureFeedFilters, readFiltersFromLocationSearch, encodeFiltersToParam } from '../utils/filterUrl';

export type UseFilterUrlSyncOptions = {
  // whether to replace history entry instead of pushing a new one
  replace?: boolean;
  // throttle ms to avoid spamming history on rapid changes
  throttleMs?: number;
};

// Simple hook to sync filters <-> URL. Minimal external dependencies (no router required).
// - initial read from URL on mount will call setFilters if a valid `f` param exists
// - when filters change, updates the URL `?f=...` (pushState by default, or replaceState)
export const useFilterUrlSync = (
  filters: FailureFeedFilters,
  setFilters: (f: FailureFeedFilters) => void,
  opts: UseFilterUrlSyncOptions = {}
) => {
  const { replace = false, throttleMs = 150 } = opts;
  const lastWrittenRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // On mount: read URL and initialize filters if present
  useEffect(() => {
    const parsed = readFiltersFromLocationSearch(window.location.search);
    if (parsed) {
      setFilters(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filters change: write to URL after throttle
  useEffect(() => {
    const param = encodeFiltersToParam(filters);
    if (lastWrittenRef.current === param) return; // avoid duplicate writes

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const query = `?f=${encodeURIComponent(param)}`;
      const newUrl = window.location.pathname + query + window.location.hash;
      try {
        if (replace) {
          window.history.replaceState({}, '', newUrl);
        } else {
          window.history.pushState({}, '', newUrl);
        }
        lastWrittenRef.current = param;
      } catch (err) {
        // Best-effort: ignore history write failures (private windows)
        // In production we might surface telemetry
      }
    }, throttleMs);

    // cleanup
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [filters, replace, throttleMs, setFilters]);
};
