import React from 'react';
import PimAdminProductList from '../../../components/PimAdminProductList';

export default function PimAdminPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/pim/products');
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data = await res.json();
        if (mounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || 'Failed to load');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: 980, margin: '24px auto' }}>
      {loading && (
        <div style={{ padding: '16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>Loading products…</div>
      )}
      {error && (
        <div style={{ padding: '16px', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, marginBottom: 12 }}>{error}</div>
      )}
      {!loading && !error && <PimAdminProductList products={products} />}
    </div>
  );
}
