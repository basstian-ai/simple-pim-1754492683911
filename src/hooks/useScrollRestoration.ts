import { useEffect } from 'react';

// A tiny helper to persist/restore a container's scrollTop using history.state.
// This hook is intentionally small and unopinionated — the component owns the ref.
export function useScrollRestoration(pathKey: string, getScrollTop: () => number, applyScrollTop: (n: number) => void) {
  useEffect(() => {
    try {
      const hs = window.history.state || {};
      const saved = hs[pathKey];
      if (saved && typeof saved.scrollTop === 'number') {
        requestAnimationFrame(() => applyScrollTop(saved.scrollTop));
      }
      // ensure initial entry exists
      if (!hs[pathKey]) {
        const copy = Object.assign({}, hs, { [pathKey]: { scrollTop: getScrollTop(), filters: {} } });
        window.history.replaceState(copy, document.title);
      }
    } catch (e) {
      // noop
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
