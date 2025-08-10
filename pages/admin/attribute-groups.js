import { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/attribute-groups');
      const json = await res.json();
      setGroups(json.groups || []);
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to create');
      }
      setName('');
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this group?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/attribute-groups/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to delete');
      }
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '20px auto', padding: 16 }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Create and manage attribute groups to organize product attributes.</p>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New group name (e.g. Specifications)"
          style={{ flex: 1, padding: 8 }}
        />
        <button disabled={loading || !name.trim()} type="submit">Add</button>
      </form>

      {error ? <div style={{ color: 'red', marginBottom: 8 }}>{error}</div> : null}

      {loading ? <div>Loading…</div> : null}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groups.map((g) => (
          <li key={g.id} style={{ border: '1px solid #e3e3e3', padding: 12, borderRadius: 6, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{g.name}</div>
              <div style={{ color: '#777', fontSize: 12 }}>code: {g.code} • attributes: {g.attributes?.length || 0}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onDelete(g.id)} style={{ background: '#fff', border: '1px solid #d33', color: '#d33' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {groups.length === 0 && !loading ? (
        <div style={{ color: '#666' }}>No attribute groups yet. Create your first one above.</div>
      ) : null}
    </div>
  );
}
