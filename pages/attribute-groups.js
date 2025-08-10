import React, { useEffect, useMemo, useState } from 'react';

export default function AttributeGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/attribute-groups')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load attribute groups');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setGroups(Array.isArray(data.groups) ? data.groups : []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups.filter((g) => {
      if (g.name && String(g.name).toLowerCase().includes(q)) return true;
      if (Array.isArray(g.attributes)) {
        return g.attributes.some(
          (a) =>
            (a.code && String(a.code).toLowerCase().includes(q)) ||
            (a.label && String(a.label).toLowerCase().includes(q))
        );
      }
      return false;
    });
  }, [groups, query]);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Browse predefined attribute groups used to model your catalog.</p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '1rem 0' }}>
        <input
          type="search"
          placeholder="Filter by group or attribute name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 6 }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', background: '#f7f7f7', borderRadius: 6, cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div style={{ color: '#b00020', background: '#fde7ea', padding: '0.75rem', borderRadius: 6, border: '1px solid #f5c2c7' }}>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: '#555' }}>No attribute groups match your filter.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((g) => (
          <div key={g.id || g.name} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{g.name}</h2>
              {g.id && (
                <code style={{ fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: 4 }}>id: {g.id}</code>
              )}
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {(g.attributes || []).map((a) => (
                <li key={a.code} style={{ margin: '0.25rem 0' }}>
                  <strong>{a.label || a.code}</strong>
                  <span style={{ color: '#6b7280' }}> ({a.type || 'text'})</span>
                  {a.required ? <span style={{ color: '#b00020' }}> • required</span> : null}
                  {Array.isArray(a.options) && a.options.length > 0 ? (
                    <span style={{ color: '#6b7280' }}> • options: {a.options.join(', ')}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
