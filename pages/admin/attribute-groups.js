import React, { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      if (!res.ok) throw new Error('Failed to load attribute groups');
      const data = await res.json();
      setGroups(Array.isArray(data.groups) ? data.groups : []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    setError('');
    const payload = {
      name: name.trim(),
      attributes: attributes,
    };
    if (!payload.name) {
      setError('Name is required');
      return;
    }
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create group');
      }
      const { group } = await res.json();
      setGroups((prev) => [...prev, group]);
      setName('');
      setAttributes('');
    } catch (e) {
      setError(e.message || 'Error');
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1>Attribute Groups</h1>

      <div style={{ margin: '10px 0 20px 0' }}>
        <button onClick={load} disabled={loading} style={{ padding: '6px 12px', cursor: 'pointer' }}>Refresh</button>
      </div>

      {error ? (
        <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>
      ) : null}

      <form onSubmit={onAdd} style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Add New Group</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 240px' }}>
            <div style={{ fontSize: 12, color: '#555' }}>Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SEO"
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <label style={{ flex: '2 1 320px' }}>
            <div style={{ fontSize: 12, color: '#555' }}>Attributes (comma-separated)</div>
            <input
              type="text"
              value={attributes}
              onChange={(e) => setAttributes(e.target.value)}
              placeholder="e.g., meta_title, meta_description"
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" style={{ padding: '8px 14px', cursor: 'pointer' }}>Add</button>
          </div>
        </div>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Attributes</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: '8px' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 12 }}>Loading…</td></tr>
            ) : groups.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 12 }}>No attribute groups yet.</td></tr>
            ) : (
              groups.map((g) => (
                <tr key={g.id}>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{g.id}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{g.name}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px', color: '#333' }}>
                    {(g.attributes || []).join(', ')}
                  </td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px', textAlign: 'right' }}>{(g.attributes || []).length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#777', fontSize: 12, marginTop: 16 }}>
        Tip: POSTs will be persisted to disk when possible during local development. On serverless, they may be kept in memory only.
      </p>
    </div>
  );
}
