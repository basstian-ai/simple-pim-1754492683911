import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import ExportCsvLink from '../components/ExportCsvLink';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      const qs = query ? `?search=${encodeURIComponent(query)}` : '';
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
  }, [query]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder="Search products by name, SKU or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
          aria-label="Search products"
        />
        <span style={{ color: '#666', fontSize: 12 }}>
          {products?.length || 0} result{(products?.length || 0) === 1 ? '' : 's'}
        </span>
        <ExportCsvLink style={{ fontSize: 12 }} />
      </div>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
