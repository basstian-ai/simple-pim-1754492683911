import React from 'react';

export default function AttributeGroupsSearchPage() {
  const [q, setQ] = React.useState('');
  const [type, setType] = React.useState('');
  const [required, setRequired] = React.useState('');
  const [state, setState] = React.useState({ loading: false, error: null, data: { count: 0, attributes: [] } });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (type) params.set('type', type);
      if (required) params.set('required', required);
      params.set('limit', '200');

      try {
        const res = await fetch(`/api/attribute-groups/search?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, error: null, data: json });
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err.message || 'Failed to load', data: { count: 0, attributes: [] } });
      }
    }

    const t = setTimeout(load, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q, type, required]);

  const { data } = state;

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>Attribute Search</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/attribute-groups" style={btn}>Groups</a>
          <a href="/admin/attribute-groups-flat" style={btn}>Flat</a>
          <a href="/admin/attribute-groups-grouped" style={btn}>Grouped</a>
          <a href="/admin/attribute-groups-duplicates" style={btn}>Duplicates</a>
        </div>
      </div>

      <p style={{ color: '#374151', marginTop: 4 }}>Quickly find attribute definitions across all groups. Filters support code, label, type, and required.</p>

      <div style={filtersRow}>
        <input
          type="text"
          placeholder="Search by code, label, or group"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={input}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={select}>
          <option value="">Any type</option>
          <option value="text">text</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="select">select</option>
        </select>
        <select value={required} onChange={(e) => setRequired(e.target.value)} style={select}>
          <option value="">Required: any</option>
          <option value="true">Required only</option>
          <option value="false">Optional only</option>
        </select>
      </div>

      {state.loading && <p>Loading…</p>}
      {state.error && <p style={{ color: '#b91c1c' }}>Error: {state.error}</p>}

      {!state.loading && !state.error && (
        <div>
          <p style={{ color: '#374151' }}>Matches: <strong>{data.count}</strong></p>
          {data.attributes.length === 0 ? (
            <div style={emptyBox}>No attributes match the current filters.</div>
          ) : (
            <ul style={list}>
              {data.attributes.map((a) => (
                <li key={`${a.groupId}:${a.code}`} style={listItem}>
                  <div style={rowWrap}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>{a.label}</strong>
                      <code style={codeBadge}>{a.code}</code>
                      <span style={pill}>{a.type}</span>
                      {a.required ? <span style={requiredPill}>required</span> : <span style={optionalPill}>optional</span>}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <a href={`/admin/attribute-group/${encodeURIComponent(a.groupId)}`} style={groupLink}>{a.groupName}</a>
                      <code style={groupCode}>{a.groupId}</code>
                    </div>
                  </div>
                  {Array.isArray(a.options) && a.options.length > 0 ? (
                    <div style={{ marginTop: 6, color: '#374151' }}>Options: {a.options.join(', ')}</div>
                  ) : null}
                  {a.unit ? (
                    <div style={{ marginTop: 6, color: '#374151' }}>Unit: {a.unit}</div>
                  ) : null}
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
const filtersRow = { display: 'flex', gap: 8, margin: '12px 0' };
const btn = { textDecoration: 'none', background: '#e5e7eb', color: '#111827', padding: '8px 12px', borderRadius: 6 };
const input = { flex: 1, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6 };
const select = { padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6 };
const emptyBox = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 };
const listItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const rowWrap = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' };
const codeBadge = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const pill = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const requiredPill = { background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const optionalPill = { background: '#f3f4f6', color: '#374151', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const groupLink = { color: '#111827', textDecoration: 'none', fontWeight: 600 };
const groupCode = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
