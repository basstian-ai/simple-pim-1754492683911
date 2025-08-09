import React, { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/attributes');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load');
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Attribute Groups</h1>
      <p style={styles.subtitle}>Predefined attribute groups to describe products and variants.</p>
      {error && <div style={styles.error}>Error: {error}</div>}
      {!data && !error && <div style={styles.loading}>Loading…</div>}
      {data && (
        <div>
          <div style={styles.meta}>Updated: {new Date(data.updatedAt).toLocaleString()}</div>
          <div style={styles.list}>
            {data.groups.map((g) => (
              <div key={g.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <button style={styles.expandBtn} onClick={() => toggle(g.id)} aria-expanded={!!expanded[g.id]} aria-controls={`group-${g.id}`}>
                    {expanded[g.id] ? '▾' : '▸'}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={styles.groupTitle}>{g.label}</div>
                    <div style={styles.groupDesc}>{g.description}</div>
                  </div>
                  <div style={styles.badge}>{g.attributes.length} fields</div>
                </div>
                {expanded[g.id] && (
                  <div id={`group-${g.id}`} style={styles.cardBody}>
                    {g.attributes.map((a) => (
                      <div key={a.code} style={styles.attrRow}>
                        <div style={styles.attrMain}>
                          <div style={styles.attrCode}>{a.code}</div>
                          <div style={styles.attrLabel}>{a.label}</div>
                        </div>
                        <div style={styles.attrMeta}>
                          <span style={styles.typeTag}>{a.type}</span>
                          {a.required && <span style={styles.requiredTag}>required</span>}
                          {Array.isArray(a.options) && a.options.length > 0 && (
                            <span style={styles.optionsTag}>{a.options.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
  title: { margin: '0 0 8px', fontSize: 28, lineHeight: '32px' },
  subtitle: { margin: '0 0 16px', color: '#555' },
  meta: { marginBottom: 12, color: '#666', fontSize: 13 },
  list: { display: 'grid', gridTemplateColumns: '1fr', gap: 12 },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' },
  cardHeader: { display: 'flex', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  groupTitle: { fontWeight: 600 },
  groupDesc: { color: '#6b7280', fontSize: 13 },
  badge: { background: '#eef2ff', color: '#3730a3', fontSize: 12, padding: '2px 8px', borderRadius: 999 },
  expandBtn: { marginRight: 8, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', padding: '2px 6px', cursor: 'pointer' },
  cardBody: { padding: 12 },
  attrRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eef2f7' },
  attrMain: { display: 'flex', alignItems: 'baseline', gap: 8 },
  attrCode: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace', fontSize: 13, background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 },
  attrLabel: { color: '#111827' },
  attrMeta: { display: 'flex', gap: 8, alignItems: 'center' },
  typeTag: { fontSize: 12, color: '#374151', background: '#f3f4f6', padding: '2px 6px', borderRadius: 999 },
  requiredTag: { fontSize: 12, color: '#991b1b', background: '#fee2e2', padding: '2px 6px', borderRadius: 999 },
  optionsTag: { fontSize: 12, color: '#065f46', background: '#d1fae5', padding: '2px 6px', borderRadius: 999 },
  loading: { padding: 12 }
};
