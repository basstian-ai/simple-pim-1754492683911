import { useEffect, useMemo, useState } from 'react';
import path from 'path';
import fs from 'fs';

export default function AttributeGroupsAdmin({ initialGroups }) {
  const [groups, setGroups] = useState(initialGroups || []);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (mounted && Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
      } catch (e) {
        if (mounted) setError('Unable to refresh groups');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(g => {
      if (g.name.toLowerCase().includes(q)) return true;
      if (g.description && g.description.toLowerCase().includes(q)) return true;
      return (g.attributes || []).some(a => (
        (a.code && a.code.toLowerCase().includes(q)) ||
        (a.label && a.label.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q))
      ));
    });
  }, [groups, query]);

  return (
    <div style={{ maxWidth: 980, margin: '32px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Browse and inspect product attribute groups configured in your PIM.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0 24px' }}>
        <input
          type="search"
          placeholder="Search groups or attributes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
          aria-label="Search"
        />
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '10px 14px', borderRadius: 8, border: 0, background: '#111', color: 'white', cursor: 'pointer' }}
          aria-busy={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {error && (
        <div role="alert" style={{ background: '#fff3f3', color: '#a00', padding: '8px 12px', borderRadius: 6, border: '1px solid #f3d6d6', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(group => (
          <div key={group.id} style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: 'white' }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
              style={{
                display: 'flex', width: '100%', textAlign: 'left', padding: '14px 16px', gap: 12, alignItems: 'center',
                border: 0, background: 'white', cursor: 'pointer', fontSize: 16
              }}
              aria-expanded={!!expanded[group.id]}
            >
              <span style={{ fontWeight: 600 }}>{group.name}</span>
              <span style={{ color: '#666' }}>• {group.attributes?.length || 0} attributes</span>
            </button>
            {group.description ? (
              <div style={{ padding: '0 16px 12px', color: '#555' }}>{group.description}</div>
            ) : null}
            {expanded[group.id] ? (
              <div style={{ padding: 16, borderTop: '1px solid #f2f2f2' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th style={th}>Code</th>
                        <th style={th}>Label</th>
                        <th style={th}>Type</th>
                        <th style={th}>Required</th>
                        <th style={th}>Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(group.attributes || []).map(attr => (
                        <tr key={attr.code}>
                          <td style={tdMono}>{attr.code}</td>
                          <td style={td}>{attr.label}</td>
                          <td style={td}>{attr.type}</td>
                          <td style={td}>{attr.required ? 'Yes' : 'No'}</td>
                          <td style={td}>{Array.isArray(attr.options) ? attr.options.join(', ') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ color: '#666', padding: '24px 4px' }}>No groups match your search.</div>
      )}
    </div>
  );
}

const th = { textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 8px', color: '#666', fontWeight: 600 };
const td = { borderBottom: '1px solid #f7f7f7', padding: '8px 8px' };
const tdMono = { ...td, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' };

export async function getStaticProps() {
  // Load initial data at build-time for fast first paint
  try {
    const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const initialGroups = JSON.parse(raw);
    return { props: { initialGroups } };
  } catch (e) {
    return { props: { initialGroups: [] } };
  }
}
