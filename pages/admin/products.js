import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', sku: '', price: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError('Failed to load products');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          price: parseFloat(form.price),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.errors?.map((x) => x.message).join(', ') || 'Create failed');
      }
      const created = await res.json();
      setItems((list) => [created, ...list]);
      setForm({ name: '', sku: '', price: '' });
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin • Products</title>
      </Head>
      <div style={{ maxWidth: 960, margin: '20px auto', padding: '0 16px' }}>
        <h1>Products</h1>
        <section style={{ margin: '16px 0', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>Add Product</h2>
          {error ? (
            <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>
          ) : null}
          <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={onChange} required style={{ padding: 8, minWidth: 240 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" value={form.sku} onChange={onChange} required style={{ padding: 8, minWidth: 160 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="price">Price</label>
                <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={onChange} required style={{ padding: 8, minWidth: 120 }} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit" disabled={submitting} style={{ padding: '8px 14px' }}>
                {submitting ? 'Saving…' : 'Create'}
              </button>
            </div>
          </form>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>All Products</h2>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td>{p.name}</td>
                      <td><code>{p.sku}</code></td>
                      <td>
                        {typeof p.price === 'number' ? p.price.toFixed(2) : p.price} {p.currency || 'USD'}
                      </td>
                      <td>{p.status || 'active'}</td>
                      <td>{Array.isArray(p.variants) ? p.variants.length : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
