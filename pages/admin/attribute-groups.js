import React, { useEffect, useState } from 'react';

export default function AdminAttributeGroups() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Organize product attributes into manageable groups.</p>
      <div style={{ marginBottom: 16 }}>
        <a href="/" style={{ color: '#0366d6', textDecoration: 'none' }}>&larr; Back</a>
      </div>

      {loading && <p>Loading…</p>}
      {error && (
        <p style={{ color: 'crimson' }}>Error: {error}</p>
      )}

      {!loading && !error && data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {data.groups && data.groups.length > 0 ? (
            data.groups.map((group) => (
              <div key={group.id} style={{ border: '1px solid #e1e4e8', borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 18, margin: 0 }}>{group.name}</h2>
                  <code style={{ color: '#6a737d' }}>{group.id}</code>
                </div>
                <ul style={{ paddingLeft: 18, marginTop: 12, marginBottom: 0 }}>
                  {(group.attributes || []).map((attr) => (
                    <li key={attr.code} style={{ marginBottom: 6 }}>
                      <strong>{attr.label}</strong>
                      <span style={{ color: '#6a737d' }}> ({attr.code})</span>
                      <span style={{ color: '#6a737d' }}> • {attr.type}</span>
                      {attr.required ? <span style={{ color: '#22863a' }}> • required</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No attribute groups found.</p>
          )}
        </div>
      )}
    </div>
  );
}
