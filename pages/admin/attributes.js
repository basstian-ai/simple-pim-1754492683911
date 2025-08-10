import React, { useEffect, useMemo, useState } from 'react';

export default function AttributesAdminPage() {
  const [data, setData] = useState({ groups: [], attributes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/attributes');
        if (!res.ok) throw new Error('Failed to load attributes');
        const json = await res.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || 'Error');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const attributesByGroup = useMemo(() => {
    const map = {};
    for (const g of data.groups) map[g.id] = [];
    for (const a of data.attributes) {
      if (!map[a.groupId]) map[a.groupId] = [];
      map[a.groupId].push(a);
    }
    return map;
  }, [data]);

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Attribute Manager</h1>
      <p style={{ color: '#555' }}>Read-only list of attribute groups and attributes.</p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          <section>
            <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Groups</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.groups.map((g) => (
                <li key={g.id} style={{ padding: '8px 12px', border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{g.label}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>code: {g.code}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>attributes: {attributesByGroup[g.id]?.length || 0}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Attributes</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Label</th>
                    <th style={thStyle}>Code</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Required</th>
                    <th style={thStyle}>Group</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attributes.map((a) => {
                    const g = data.groups.find((x) => x.id === a.groupId);
                    return (
                      <tr key={a.id}>
                        <td style={tdStyle}>{a.label}</td>
                        <td style={tdStyle}><code>{a.code}</code></td>
                        <td style={tdStyle}>{a.type}</td>
                        <td style={tdStyle}>{a.required ? 'Yes' : 'No'}</td>
                        <td style={tdStyle}>{g ? g.label : a.groupId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  fontSize: 12,
  color: '#666',
  borderBottom: '1px solid #eee',
  padding: '8px 6px',
};

const tdStyle = {
  padding: '10px 6px',
  borderBottom: '1px solid #f1f1f1',
};
