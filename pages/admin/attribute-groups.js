import { useEffect, useMemo, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [data, setData] = useState({ groups: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error('Failed to load attribute groups');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return data.groups || [];
    const q = query.toLowerCase();
    return (data.groups || []).map((g) => ({
      ...g,
      attributes: (g.attributes || []).filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          (a.label || '').toLowerCase().includes(q) ||
          (g.name || '').toLowerCase().includes(q)
      ),
    })).filter((g) => (g.attributes || []).length > 0);
  }, [data.groups, query]);

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ margin: '0 0 8px' }}>Attribute Groups</h1>
      <p style={{ margin: '0 0 16px', color: '#555' }}>
        Read-only view of attribute groups and variant attributes. Use this to align product data modeling.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Filter by group, code, or label..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: '1 1 auto', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}
          aria-label="Filter attributes"
        />
        <a href="/api/attribute-groups" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button style={buttonStyle}>API</button>
        </a>
        <a href="/api/attribute-groups?flat=1" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button style={buttonStyle}>Flat JSON</button>
        </a>
      </div>

      {loading && <div>Loading attribute groups…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((group) => (
            <div key={group.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{group.name}</h2>
                <span style={pillStyle}>{group.id}</span>
              </div>
              {group.description && (
                <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 14 }}>{group.description}</p>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {(group.attributes || []).map((attr) => (
                  <li key={attr.code} style={{ border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 14 }}>{attr.label}</strong>
                      <code style={{ color: '#555', fontSize: 12 }}>{attr.code}</code>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      <span style={metaStyle}>type: {attr.type}</span>
                      {attr.unit && <span style={metaStyle}>unit: {attr.unit}</span>}
                      <span style={metaStyle}>variant: {attr.useInVariant ? 'yes' : 'no'}</span>
                      {attr.required && <span style={metaStyle}>required</span>}
                    </div>
                    {Array.isArray(attr.options) && attr.options.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {attr.options.map((opt) => (
                          <span key={opt} style={optionStyle}>{opt}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer'
};

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  background: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
};

const pillStyle = {
  background: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  color: '#374151'
};

const metaStyle = {
  background: '#f9fafb',
  border: '1px solid #f3f4f6',
  borderRadius: 4,
  padding: '2px 6px',
  fontSize: 12,
  color: '#374151'
};

const optionStyle = {
  background: '#eef2ff',
  border: '1px solid #e0e7ff',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  color: '#3730a3'
};
