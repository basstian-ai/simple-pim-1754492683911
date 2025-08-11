import React from 'react';

export default function AdminAttributeGroupsGroupedPage() {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });
  const [open, setOpen] = React.useState({});

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ loading: true, error: null, data: null });
      try {
        const res = await fetch('/api/attribute-groups/grouped');
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, error: null, data: json });
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err.message || 'Failed to load', data: null });
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function toggle(id) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const groups = state.data?.groups || [];
  const total = state.data?.count || 0;

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>Attribute Groups (Grouped)</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/attribute-groups-flat" style={btn}>Flat view</a>
          <a href="/api/attribute-groups/flat/export" style={btnPrimary}>Export All CSV</a>
        </div>
      </div>

      {state.loading && <p>Loading…</p>}
      {state.error && <p style={{ color: '#b91c1c' }}>Error: {state.error}</p>}

      {state.data && (
        <div>
          <p style={{ color: '#374151' }}>Total attributes: {total}</p>
          <ul style={groupList}>
            {groups.map((g) => (
              <li key={g.id} style={groupItem}>
                <div style={groupHeader}>
                  <button onClick={() => toggle(g.id)} style={toggleBtn} aria-expanded={!!open[g.id]}>
                    {open[g.id] ? '▾' : '▸'}
                  </button>
                  <strong style={{ fontSize: 16 }}>{g.name}</strong>
                  <code style={codeBadge}>{g.id}</code>
                  <span style={countPill}>{g.count}</span>
                </div>
                {open[g.id] && (
                  <ul style={attrList}>
                    {(g.attributes || []).map((a) => (
                      <li key={`${g.id}-${a.code}`} style={attrItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <strong>{a.name || a.code}</strong>
                          <code style={smallCode}>{a.code}</code>
                          {a.type ? <span style={typePill}>{a.type}</span> : null}
                          {a.required === true ? <span style={requiredPill}>required</span> : <span style={optionalPill}>optional</span>}
                        </div>
                        {Array.isArray(a.options) && a.options.length > 0 ? (
                          <div style={{ marginTop: 6, color: '#374151' }}>Options: {a.options.join(', ')}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 };
const btn = { textDecoration: 'none', background: '#e5e7eb', color: '#111827', padding: '8px 12px', borderRadius: 6 };
const btnPrimary = { textDecoration: 'none', background: '#111827', color: '#fff', padding: '8px 12px', borderRadius: 6 };
const groupList = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 };
const groupItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const groupHeader = { display: 'flex', alignItems: 'center', gap: 8 };
const toggleBtn = { border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' };
const codeBadge = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const countPill = { marginLeft: 'auto', background: '#eef2ff', color: '#3730a3', padding: '2px 8px', borderRadius: 999, fontSize: 12 };
const attrList = { listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 8 };
const attrItem = { borderTop: '1px solid #f3f4f6', paddingTop: 8 };
const smallCode = { background: '#ecfeff', color: '#155e75', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const typePill = { background: '#e0f2fe', color: '#075985', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const requiredPill = { background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const optionalPill = { background: '#f3f4f6', color: '#374151', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
