import React, { useEffect, useState } from 'react';

export default function AttributeGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error('Failed to load attribute groups');
        const data = await res.json();
        if (!cancelled) {
          setGroups(Array.isArray(data.groups) ? data.groups : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Unknown error');
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
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Predefined product attribute groups commonly used in a PIM.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && groups.length === 0 && <p>No attribute groups defined.</p>}

      <div>
        {groups.map((group) => (
          <section key={group.id} style={{ marginBottom: 16, border: '1px solid #e5e5e5', borderRadius: 8, padding: 16 }}>
            <h2 style={{ margin: '0 0 8px' }}>{group.name}</h2>
            {group.description && (
              <p style={{ marginTop: 0, color: '#666' }}>{group.description}</p>
            )}
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Array.isArray(group.attributes) && group.attributes.map((attr) => (
                <li key={attr.code} style={{ margin: '6px 0' }}>
                  <strong>{attr.label}</strong> <span style={{ color: '#999' }}>({attr.code})</span>
                  <span style={{ color: '#333' }}> — {attr.type}</span>
                  {attr.required ? <span style={{ color: '#c00' }}> • required</span> : null}
                  {attr.unit ? <span> • unit: {attr.unit}</span> : null}
                  {Array.isArray(attr.options) && attr.options.length > 0 ? (
                    <span> • options: {attr.options.join(', ')}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
