import React, { useEffect, useState } from 'react';
const { listGroups, createGroup, updateGroup, deleteGroup } = require('../../lib/attributeGroups');

export default function AttributeGroupsAdminPage() {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Client-only load
    try {
      const data = listGroups();
      setGroups(data);
    } catch (e) {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  function refresh() {
    const data = listGroups();
    setGroups(data);
  }

  async function onAdd(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    try {
      createGroup({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      refresh();
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(g) {
    setEditingId(g.id);
    setEditName(g.name);
    setEditDescription(g.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  }

  function saveEdit(id) {
    setError('');
    if (!editName.trim()) {
      setError('Name is required');
      return;
    }
    try {
      updateGroup(id, { name: editName.trim(), description: editDescription });
      cancelEdit();
      refresh();
    } catch (e) {
      setError(e.message || 'Update failed');
    }
  }

  function onDelete(id) {
    if (!confirm('Delete this attribute group?')) return;
    try {
      deleteGroup(id);
      refresh();
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Attribute Groups</h1>
      <p style={styles.muted}>Manage groups of attributes to organize your product data. Stored locally in your browser.</p>

      <form onSubmit={onAdd} style={styles.card}>
        <h2 style={styles.h2}>Create New Group</h2>
        {error ? <div style={styles.error}>{error}</div> : null}
        <div style={styles.row}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dimensions"
          />
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Description</label>
          <input
            style={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
        <button type="submit" disabled={saving} style={styles.buttonPrimary}>
          {saving ? 'Creating…' : 'Add Group'}
        </button>
      </form>

      <div style={styles.card}>
        <h2 style={styles.h2}>Existing Groups</h2>
        {!loaded ? (
          <div>Loading…</div>
        ) : groups.length === 0 ? (
          <div style={styles.muted}>No attribute groups yet. Create one above.</div>
        ) : (
          <ul style={styles.list}>
            {groups.map((g) => (
              <li key={g.id} style={styles.listItem}>
                {editingId === g.id ? (
                  <div style={styles.editContainer}>
                    <input
                      style={styles.input}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      style={styles.input}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div>
                      <button onClick={() => saveEdit(g.id)} style={styles.buttonPrimary}>Save</button>
                      <button onClick={cancelEdit} style={styles.button}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.itemRow}>
                    <div>
                      <div style={styles.itemTitle}>{g.name}</div>
                      {g.description ? <div style={styles.itemDesc}>{g.description}</div> : null}
                    </div>
                    <div>
                      <button onClick={() => startEdit(g)} style={styles.button}>Edit</button>
                      <button onClick={() => onDelete(g.id)} style={styles.buttonDanger}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif' },
  h1: { margin: '0 0 1rem 0' },
  h2: { margin: '0 0 1rem 0', fontSize: '1.1rem' },
  muted: { color: '#666' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, margin: '1rem 0' },
  row: { display: 'flex', flexDirection: 'column', marginBottom: 12 },
  label: { fontSize: 12, color: '#333', marginBottom: 4 },
  input: { padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', marginBottom: 8 },
  buttonPrimary: { background: '#0070f3', color: '#fff', border: '1px solid #0070f3', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', marginRight: 8 },
  button: { background: '#f5f5f5', color: '#111', border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', marginRight: 8 },
  buttonDanger: { background: '#fff0f0', color: '#b00020', border: '1px solid #ffb3b3', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  listItem: { borderTop: '1px solid #eee', padding: '12px 0' },
  itemRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontWeight: 600 },
  itemDesc: { color: '#555', fontSize: 13, marginTop: 4 },
  editContainer: { display: 'grid', gridTemplateColumns: '2fr 3fr auto', gap: 8, alignItems: 'center' },
};
