import React from 'react';

export default function AdminAttributeGroupsFlatPage() {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ loading: true, error: null, data: null });
      try {
        const res = await fetch('/api/attribute-groups/flat');
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
  }, []);

  const count = state.data?.count || 0;
  const items = Array.isArray(state.data?.attributes) ? state.data.attributes : [];

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>Attribute Groups (Flat)</h1>
        <a href="/api/attribute-groups/flat/export" style={btnPrimary}>Export CSV</a>
      </div>

      {state.loading && <p>Loading…</p>}
      {state.error && <p style={{ color: '#b91c1c' }}>Error: {state.error}</p>}

      {state.data && (
        <div>
          <p style={{ color: '#374151' }}>Found {count} attribute{count === 1 ? '' : 's'}.</p>
          {items.length > 0 ? (
            <ul style={list}>
              {items.map((a, idx) => (
                <li key={`${a.groupId || a.groupName || 'g'}-${a.code || idx}`} style={listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong>{a.name || a.code}</strong>
                    {a.code ? <code style={codeBadge}>{a.code}</code> : null}
                    {a.groupName ? <span style={pill}>{a.groupName}</span> : null}
                    {a.type ? <span style={typePill}>{a.type}</span> : null}
                    {a.required === true ? <span style={requiredPill}>required</span> : <span style={optionalPill}>optional</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280' }}>No attributes.</p>
          )}
        </div>
      )}
    </div>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 };
const listItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const codeBadge = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const pill = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const typePill = { background: '#ecfeff', color: '#155e75', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const requiredPill = { background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const optionalPill = { background: '#f3f4f6', color: '#374151', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const btnPrimary = { textDecoration: 'none', background: '#111827', color: '#fff', padding: '8px 12px', borderRadius: 6 };
