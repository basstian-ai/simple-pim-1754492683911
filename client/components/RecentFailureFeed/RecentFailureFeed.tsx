import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window';

// Lightweight, dependency-minimal feed with virtualization and cursor-based incremental loading.
// Assumes an endpoint at /api/failures that implements cursor-based pagination.

type FailureItem = {
  id: string;
  created_at: string;
  channel: string;
  job_id: string;
  error: string;
};

const ROW_HEIGHT = 88;
const PAGE_SIZE = 20;

export default function RecentFailureFeed() {
  const [items, setItems] = useState<FailureItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const listRef = useRef<List | null>(null);

  const hasMore = Boolean(nextCursor);

  const fetchPage = useCallback(async (cursor?: string) => {
    setIsError(null);
    setIsLoading(true);
    try {
      const url = new URL('/api/failures', window.location.origin);
      url.searchParams.set('limit', String(PAGE_SIZE));
      if (cursor) url.searchParams.set('cursor', cursor);

      const r = await fetch(url.toString(), { method: 'GET' });
      if (!r.ok) throw new Error(`Failed to fetch (${r.status})`);
      const data = await r.json();
      if (!Array.isArray(data.items)) throw new Error('Bad payload');

      if (!cursor) {
        // initial load: replace
        setItems(data.items);
      } else {
        // append
        setItems(prev => prev.concat(data.items));
      }
      setNextCursor(data.nextCursor);
    } catch (err: any) {
      console.error('RecentFailureFeed fetch error', err);
      setIsError(err?.message ?? 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // item loading helpers for react-window style infinite list
  const isItemLoaded = (index: number) => index < items.length;

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    if (!nextCursor) return; // no more
    await fetchPage(nextCursor);
  }, [isLoading, nextCursor, fetchPage]);

  // When the list reports that the last visible index is near the end, trigger loadMore
  const handleItemsRendered = (props: ListOnItemsRenderedProps) => {
    const { visibleStopIndex } = props;
    const threshold = 3; // start loading when within 3 rows of the end
    if (visibleStopIndex >= items.length - 1 - threshold && nextCursor && !isLoading) {
      // fire and forget
      loadMore().catch(() => {});
    }
  };

  const itemCount = items.length + (nextCursor ? 1 : 0);

  // simple row renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!isItemLoaded(index)) {
      // loading placeholder row
      return (
        <div style={{ ...style, padding: 12, boxSizing: 'border-box' }} className="rff-row rff-skeleton">
          <div style={{ height: 12, width: '50%', background: '#eee', borderRadius: 4, marginBottom: 8 }}></div>
          <div style={{ height: 10, width: '30%', background: '#f1f1f1', borderRadius: 4 }}></div>
        </div>
      );
    }

    const item = items[index];
    return (
      <div style={{ ...style, padding: 12, boxSizing: 'border-box' }} className="rff-row">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <strong>{item.channel}</strong>
          <small style={{ color: '#666' }}>{new Date(item.created_at).toLocaleString()}</small>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#b00' }}>{item.error}</div>
            <div style={{ fontSize: 12, color: '#444' }}>Job: {item.job_id}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: 480, border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
      {isError && (
        <div style={{ padding: 8, background: '#fff3f3', color: '#900' }}>Error loading feed: {isError}</div>
      )}

      <List
        height={480}
        itemCount={Math.max(5, itemCount)}
        itemSize={ROW_HEIGHT}
        width="100%"
        onItemsRendered={handleItemsRendered}
        ref={listRef}
      >
        {Row}
      </List>

      {/* lightweight footer with load state */}
      <div style={{ padding: 8, textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
        {isLoading ? 'Loading…' : nextCursor ? 'Scroll to load more' : 'End of feed'}
      </div>
    </div>
  );
}
