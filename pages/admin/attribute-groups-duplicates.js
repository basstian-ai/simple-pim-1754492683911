import React from 'react';

export default function AttributeGroupsDuplicatesPage() {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });
  const [min, setMin] = React.useState(2);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ loading: true, error: null, data: null });
      try {
        const res = await fetch(`/api/attribute-groups/duplicates?min=${encodeURIComponent(min)}`);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, error: null, data: json });
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err.message || 'Failed to load', data: null });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [min]);

  const report = state.data || { count: 0, byCode: [] };

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>Attribute Duplicates Audit</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/attribute-groups" style={btn}>Groups</a>
          <a href="/admin/attribute-groups-flat" style={btn}>Flat view</a>
          <a href="/admin/attribute-groups-grouped" style={btn}>Grouped view</a>
        </div>
      </div>

      <p style={{ color: '#374151', marginTop: 4 }}>Find attribute code collisions across groups. Useful to spot conflicting definitions before export/integration.</p>

      <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="min" style={{ color: '#374151' }}>Minimum occurrences per code:</label>
        <input id="min" type="number" min={2} value={min} onChange={(e) => setMin(Math.max(2, Number(e.target.value) || 2))} style={input} />
      </div>

      {state.loading && <p>Loading…</p>}
      {state.error && <p style={{ color: '#b91c1c' }}>Error: {state.error}</p>}

      {!state.loading && !state.error && (
        <div>
          <p style={{ color: '#374151' }}>Duplicate codes found: <strong>{report.count}</strong></p>
          {report.count === 0 ? (
            <div style={emptyBox}>No duplicate attribute codes detected with min ≥ {min}.</div>
          ) : (
            <ul style={list}>
              {report.byCode.map((item) => (
                <li key={item.code} style={listItem}>
                  <div style={row}>
                    <strong style={{ fontSize: 16 }}>{item.code}</strong>
                    <span style={pill}>{item.total} occurrences</span>
                  </div>
                  <ul style={innerList}>
                    {item.groups.map((g) => (
                      <li key={g.id} style={groupRow}>
                        <a href={`/admin/attribute-group/${encodeURIComponent(g.id)}`} style={groupLink}>{g.name}</a>
                        <span style={countPill}>{g.count} in group</span>
                        <code style={codeBadge}>{g.id}</code>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 };
const btn = { textDecoration: 'none', background: '#e5e7eb', color: '#111827', padding: '8px 12px', borderRadius: 6 };
const input = { width: 100, padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6 };
const emptyBox = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 };
const listItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const row = { display: 'flex', alignItems: 'center', gap: 8 };
const pill = { marginLeft: 'auto', background: '#eef2ff', color: '#3730a3', padding: '2px 8px', borderRadius: 999, fontSize: 12 };
const innerList = { listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 8 };
const groupRow = { display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #f3f4f6', paddingTop: 8 };
const groupLink = { color: '#111827', textDecoration: 'none', fontWeight: 600 };
const countPill = { background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: 999, fontSize: 12 };
const codeBadge = { marginLeft: 'auto', background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };