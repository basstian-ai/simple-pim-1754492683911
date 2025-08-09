import { useEffect, useMemo, useState } from 'react';

export default function AttributeGroupsAdminPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setGroups(Array.isArray(data.groups) ? data.groups : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        attributes: (g.attributes || []).filter(
          (a) => a.code.toLowerCase().includes(q) || (a.label || '').toLowerCase().includes(q)
        )
      }))
      .filter((g) => g.name.toLowerCase().includes(q) || (g.attributes || []).length > 0);
  }, [groups, query]);

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 12 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Browse product attribute groups. Use search to quickly find attributes across groups.</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '16px 0 24px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groups or attributes..."
          aria-label="Search attribute groups"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#f6f6f6' }}>
            Clear
          </button>
        )}
      </div>

      {loading && <div>Loading attribute groups…</div>}
      {error && (
        <div style={{ color: '#b00020', marginBottom: 16 }}>Error loading attribute groups: {String(error)}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: '#666' }}>No attribute groups match your search.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map((group) => (
          <section key={group.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>{group.name}</h2>
              <span style={{ fontSize: 12, color: '#666' }}>{(group.attributes || []).length} attrs</span>
            </header>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(group.attributes || []).map((a) => (
                <li key={a.code} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #f0f0f0', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: '#333' }}>{a.label || a.code}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Code: {a.code}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
