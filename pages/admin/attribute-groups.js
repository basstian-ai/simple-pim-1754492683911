import { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setGroups(data);
    } catch (e) {
      setError('Failed to load attribute groups');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createGroup(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create');
      setNewName('');
      await load();
    } catch (e) {
      alert('Failed to create group');
    }
  }

  async function saveEdit(id) {
    const name = editingName.trim();
    if (!name) return;
    try {
      const res = await fetch(`/api/attribute-groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setEditingId(null);
      setEditingName('');
      await load();
    } catch (e) {
      alert('Failed to update group');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this attribute group?')) return;
    try {
      const res = await fetch(`/api/attribute-groups/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
      await load();
    } catch (e) {
      alert('Failed to delete group');
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>Attribute Groups</h1>

      <form onSubmit={createGroup} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="New group name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: 8, width: '60%', marginRight: 8 }}
        />
        <button type="submit">Add Group</button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && groups.length === 0 && <div>No attribute groups yet.</div>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groups.map((g) => (
          <li key={g.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 8 }}>
            {editingId === g.id ? (
              <div>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  style={{ padding: 6, width: '60%', marginRight: 8 }}
                />
                <button onClick={() => saveEdit(g.id)} style={{ marginRight: 8 }}>Save</button>
                <button onClick={() => { setEditingId(null); setEditingName(''); }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>{g.name}</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>{g.attributes?.length || 0} attributes</div>
                </div>
                <div>
                  <button
                    onClick={() => { setEditingId(g.id); setEditingName(g.name); }}
                    style={{ marginRight: 8 }}
                  >
                    Rename
                  </button>
                  <button onClick={() => remove(g.id)} style={{ color: '#b00' }}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p style={{ color: '#888', fontSize: 12 }}>
        Data is stored in-memory per server instance for demo purposes.
      </p>
    </div>
  );
}
