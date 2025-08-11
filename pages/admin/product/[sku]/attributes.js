import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ProductAttributesFlatPage() {
  const router = useRouter();
  const { sku } = router.query || {};
  const [state, setState] = React.useState({ loading: true, error: null, data: null });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!sku || typeof sku !== 'string') return;
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(sku)}/attributes/flat`);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, error: null, data: json });
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err.message || 'Failed to load', data: null });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sku]);

  const count = state.data?.count || 0;

  return (
    <div style={container}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/products">
          <a>&larr; Back to Admin Products</a>
        </Link>
      </div>
      <h1 style={{ margin: '8px 0' }}>Attributes for {sku || ''}</h1>
      {state.loading && <p>Loading…</p>}
      {state.error && <p style={{ color: '#b91c1c' }}>Error: {state.error}</p>}
      {state.data && (
        <>
          <p style={{ color: '#374151' }}>Found {count} attribute{count === 1 ? '' : 's'}.</p>
          {Array.isArray(state.data.attributes) && state.data.attributes.length > 0 ? (
            <ul style={list}>
              {state.data.attributes.map((a, idx) => (
                <li key={`${a.groupId || a.groupName || 'g'}-${a.code || idx}`} style={listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong>{a.name || a.code}</strong>
                    {a.code ? <code style={codeBadge}>{a.code}</code> : null}
                    {a.groupName ? <span style={pill}>{a.groupName}</span> : null}
                    {a.type ? <span style={typePill}>{a.type}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No attributes.</p>
          )}
        </>
      )}
    </div>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 };
const listItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const codeBadge = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const pill = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const typePill = { background: '#ecfeff', color: '#155e75', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
