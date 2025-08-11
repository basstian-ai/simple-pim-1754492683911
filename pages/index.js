import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ProductList from '../components/ProductList';
import ExportCsvLink from '../components/ExportCsvLink';
import StockFilterToggle from '../components/StockFilterToggle';
import { addTimestampsToProducts } from '../lib/ensureTimestamps';
import { addImagesToProducts } from '../lib/ensureProductImages';
import paginate from '../lib/pagination';

const Home = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // ref for the search input so we can focus it via keyboard shortcut
  const searchInputRef = useRef(null);

  const initializedFromUrl = useRef(false);

  // Initialize filter state from URL on first render
  useEffect(() => {
    if (initializedFromUrl.current) return;
    const q = router?.query || {};
    if (typeof q.search === 'string') setQuery(q.search);
    if (typeof q.tags === 'string' && q.tags.trim()) {
      setSelectedTags(q.tags.split(',').map((t) => decodeURIComponent(t)));
    }
    if (q.inStock === '1' || q.inStock === 'true') setInStockOnly(true);
    if (q.page) {
      const p = parseInt(q.page, 10);
      if (!Number.isNaN(p) && p > 0) setPage(p);
    }
    initializedFromUrl.current = true;
  }, [router?.query]);

  // Keep URL in sync with filters (for shareable links and CSV export)
  useEffect(() => {
    // Avoid pushing identical queries repeatedly
    const nextQuery = {};
    if (query) nextQuery.search = query;
    if (selectedTags.length) nextQuery.tags = selectedTags.join(',');
    if (inStockOnly) nextQuery.inStock = '1';
    if (page && page > 1) nextQuery.page = String(page);

    const current = router?.query || {};
    const same =
      current.search === nextQuery.search &&
      (current.tags || '') === (nextQuery.tags || '') &&
      (current.inStock || '') === (nextQuery.inStock || '') &&
      ((current.page || '') === (nextQuery.page || ''));

    if (!same) {
      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
    }
  }, [query, selectedTags, inStockOnly, page]);

  // reset to first page when main filters change
  useEffect(() => {
    setPage(1);
  }, [query, selectedTags, inStockOnly]);

  useEffect(() => {
    let cancelled = false;
    const loadTags = async () => {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        if (!cancelled) setAllTags(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setAllTags([]);
      }
    };
    loadTags();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      const params = [];
      if (query) params.push(`search=${encodeURIComponent(query)}`);
      if (selectedTags.length > 0) params.push(`tags=${selectedTags.map(encodeURIComponent).join(',')}`);
      if (inStockOnly) params.push('inStock=1');
      const qs = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`/api/products${qs}`, { signal: controller.signal });
      const data = await res.json();
      // augment products with deterministic timestamps for richer UI and export
      const augmented = addTimestampsToProducts(Array.isArray(data) ? data : []);
      // also ensure each product has a deterministic placeholder image
      const withImages = addImagesToProducts(augmented);
      if (active) setProducts(withImages);
    };

    const t = setTimeout(fetchProducts, 250);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(t);
    };
  }, [query, selectedTags, inStockOnly]);

  // Keyboard shortcut: press '/' to focus the search input
  useEffect(() => {
    const handler = (e) => {
      // only trigger on the '/' key, ignore when focus is already in an input/textarea
      if (e.key === '/') {
        const active = document.activeElement;
        const tag = active && active.tagName && active.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          if (searchInputRef.current) searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return [...prev, tag];
    });
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setInStockOnly(false);
    setPage(1);
  };

  const anyFilterActive = query || selectedTags.length > 0 || inStockOnly;

  const { pageItems: displayedProducts, total, totalPages } = paginate(products, page, pageSize);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search products by name, SKU or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
          aria-label="Search products"
        />
        <StockFilterToggle checked={inStockOnly} onChange={setInStockOnly} />
        <span style={{ color: '#666', fontSize: 12 }}>
          {total || 0} result{(total || 0) === 1 ? '' : 's'}
        </span>
        <ExportCsvLink style={{ fontSize: 12 }} />

        {/* Render a compact clear-all action when any of the main filters are active */}
        {anyFilterActive && (
          <button
            onClick={clearAllFilters}
            aria-label="Clear filters"
            style={{ padding: '0.25rem 0.5rem', borderRadius: 6, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer', fontSize: 12 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 999,
                  border: '1px solid ' + (active ? '#0b64d8' : '#ddd'),
                  background: active ? '#e7f1ff' : 'white',
                  color: active ? '#0b64d8' : '#333',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {tag}
              </button>
            );
          })}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              style={{
                marginLeft: 'auto',
                padding: '0.25rem 0.5rem',
                borderRadius: 6,
                border: '1px solid #ddd',
                background: '#fafafa',
                cursor: 'pointer',
                fontSize: 12,
              }}
              aria-label="Clear selected tags"
            >
              Clear tags
            </button>
          )}
        </div>
      )}

      <ProductList products={displayedProducts} />

      {/* Pagination controls (client-side) */}
      {total > pageSize && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
            style={{ padding: '0.4rem 0.6rem', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
          >
            Prev
          </button>
          <span style={{ color: '#666', fontSize: 13 }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label="Next page"
            style={{ padding: '0.4rem 0.6rem', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
