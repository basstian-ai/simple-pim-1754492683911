import { useEffect, useState } from 'react';
import {
  loadGroups,
  saveGroups,
  addGroupPure,
  updateGroupPure,
  deleteGroupPure,
  moveGroupPure,
  slugify,
} from '../../lib/attributeGroups';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');

  useEffect(() => {
    const initial = loadGroups();
    setGroups(initial);
    setLoaded(true);
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const next = addGroupPure(groups, { name: name.trim(), code: code.trim() });
    setGroups(next);
    saveGroups(next);
    setName('');
    setCode('');
  }

  function startEdit(group) {
    setEditingId(group.id);
    setEditName(group.name);
    setEditCode(group.code);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditCode('');
  }

  function saveEdit(id) {
    const next = updateGroupPure(groups, id, {
      name: editName,
      code: editCode,
    });
    setGroups(next);
    saveGroups(next);
    cancelEdit();
  }

  function handleDelete(id) {
    // eslint-disable-next-line no-alert
    if (!confirm('Delete this attribute group?')) return;
    const next = deleteGroupPure(groups, id);
    setGroups(next);
    saveGroups(next);
  }

  function moveUp(index) {
    const next = moveGroupPure(groups, index, index - 1);
    setGroups(next);
    saveGroups(next);
  }

  function moveDown(index) {
    const next = moveGroupPure(groups, index, index + 1);
    setGroups(next);
    saveGroups(next);
  }

  function doExport() {
    const data = JSON.stringify(groups, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attribute-groups.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function doImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'));
        if (Array.isArray(parsed)) {
          const sanitized = parsed
            .filter((g) => g && g.id && g.name)
            .map((g) => ({ id: g.id, name: String(g.name), code: slugify(g.code || g.name) }));
          setGroups(sanitized);
          saveGroups(sanitized);
        } else {
          // eslint-disable-next-line no-alert
          alert('Invalid file format');
        }
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('Failed to import JSON');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ maxWidth: 840, margin: '32px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Create and manage attribute groups for your product information model. Data is saved locally in your browser.</p>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create new group</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="name" style={{ fontSize: 12, color: '#555' }}>Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basic Information"
              required
              style={{ padding: '8px 10px', minWidth: 240, border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="code" style={{ fontSize: 12, color: '#555' }}>Code (optional)</label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="auto-generated from name if empty"
              style={{ padding: '8px 10px', minWidth: 240, border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>
          <button type="submit" style={{ background: '#111827', color: 'white', border: 0, padding: '10px 14px', borderRadius: 6, cursor: 'pointer' }}>Add group</button>
        </form>
      </section>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Groups ({groups.length})</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={doExport} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Export JSON</button>
            <label style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
              Import JSON
              <input type="file" accept="application/json" onChange={doImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        {!loaded ? (
          <div style={{ color: '#6b7280' }}>Loading…</div>
        ) : groups.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No attribute groups yet. Create your first one above.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {groups.map((g, idx) => (
              <li key={g.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid #f3f4f6', padding: '12px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button title="Move up" onClick={() => moveUp(idx)} disabled={idx === 0} style={{ border: '1px solid #d1d5db', background: 'white', padding: 2, borderRadius: 4, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>▲</button>
                  <button title="Move down" onClick={() => moveDown(idx)} disabled={idx === groups.length - 1} style={{ border: '1px solid #d1d5db', background: 'white', padding: 2, borderRadius: 4, cursor: idx === groups.length - 1 ? 'not-allowed' : 'pointer' }}>▼</button>
                </div>
                {editingId === g.id ? (
                  <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 240 }} />
                    <input value={editCode} onChange={(e) => setEditCode(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 160 }} />
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button onClick={() => saveEdit(g.id)} style={{ background: '#111827', color: 'white', border: 0, padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Save</button>
                      <button onClick={cancelEdit} style={{ background: 'white', color: '#111827', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 280 }}>
                      <div style={{ fontWeight: 600 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Code: {g.code}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(g)} style={{ background: 'white', color: '#111827', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(g.id)} style={{ background: '#b91c1c', color: 'white', border: 0, padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div style={{ marginTop: 24, color: '#6b7280', fontSize: 12 }}>
        Tip: You can bookmark this page. Import/export lets you move groups between browsers or environments.
      </div>
    </div>
  );
}
