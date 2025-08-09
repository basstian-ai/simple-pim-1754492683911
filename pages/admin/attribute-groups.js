import { useEffect, useState } from 'react';

function parseAttributes(csv) {
  // Format: code:label; code2:label2 ...
  if (!csv) return [];
  return csv
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [code, label] = pair.split(':');
      return { code: (code || '').trim(), label: (label || '').trim() };
    })
    .filter((a) => a.code);
}

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [attrsCsv, setAttrsCsv] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setGroups(json.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { name, attributes: parseAttributes(attrsCsv) };
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Create failed');
      setName('');
      setAttrsCsv('');
      setGroups((prev) => [json.data, ...prev]);
    } catch (e) {
      setError(e.message || 'Create failed');
    }
  }

  async function onDelete(id) {
    setError('');
    try {
      const res = await fetch(`/api/attribute-groups/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Delete failed');
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#666' }}>Define reusable attribute groups for your products, like Specifications, Dimensions, or Care Instructions.</p>

      <form onSubmit={onCreate} style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Create a new Group</h3>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Name</div>
          <input
            type="text"
            placeholder="e.g. Specifications"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
            required
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Attributes (code:label; code2:label2)</div>
          <input
            type="text"
            placeholder="color:Color; size:Size; material:Material"
            value={attrsCsv}
            onChange={(e) => setAttrsCsv(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </label>
        <button type="submit" style={{ background: '#111827', color: 'white', border: 0, padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}>Create</button>
        {error ? <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div> : null}
      </form>

      {loading ? (
        <div>Loading…</div>
      ) : groups.length === 0 ? (
        <div style={{ color: '#6b7280' }}>No attribute groups yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {groups.map((g) => (
            <div key={g.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>#{g.id} · {g.attributes?.length || 0} attributes</div>
                </div>
                <div>
                  <button onClick={() => onDelete(g.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 0, padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
              {g.attributes && g.attributes.length > 0 ? (
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
                  {g.attributes.map((a) => (
                    <li key={a.code}>
                      <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{a.code}</span>
                      <span style={{ color: '#6b7280', marginLeft: 8 }}>{a.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>No attributes</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
