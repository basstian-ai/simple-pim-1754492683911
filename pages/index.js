import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import ExportCsvLink from '../components/ExportCsvLink';
import StockFilterToggle from '../components/StockFilterToggle';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

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
      if (active) setProducts(data);
    };

    const t = setTimeout(fetchProducts, 250);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(t);
    };
  }, [query, selectedTags, inStockOnly]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return [...prev, tag];
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search products by name, SKU or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
          aria-label="Search products"
        />
        <StockFilterToggle checked={inStockOnly} onChange={setInStockOnly} />
        <span style={{ color: '#666', fontSize: 12 }}>
          {products?.length || 0} result{(products?.length || 0) === 1 ? '' : 's'}
        </span>
        <ExportCsvLink style={{ fontSize: 12 }} />
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

      <ProductList products={products} />
    </div>
  );
};

export default Home;
