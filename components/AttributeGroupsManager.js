import React from 'react';
const ag = require('../lib/attributeGroups');

function useAttributeGroups() {
  const [groups, setGroups] = React.useState([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setGroups(ag.listGroups());
    setHydrated(true);
  }, []);

  const add = (group) => {
    const updated = ag.upsertGroup(group);
    setGroups(updated);
  };
  const update = (group) => {
    const updated = ag.upsertGroup(group);
    setGroups(updated);
  };
  const remove = (id) => {
    const updated = ag.deleteGroup(id);
    setGroups(updated);
  };
  const importJson = (json) => {
    const updated = ag.importGroupsJson(json);
    setGroups(updated);
  };
  const exportJson = () => ag.exportGroupsJson();

  return { groups, setGroups, hydrated, add, update, remove, importJson, exportJson };
}

export default function AttributeGroupsManager() {
  const { groups, hydrated, add, update, remove, importJson, exportJson } = useAttributeGroups();
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', description: '' });
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (editing) {
      setForm({ name: editing.name || '', description: editing.description || '' });
    } else {
      setForm({ name: '', description: '' });
    }
  }, [editing]);

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editing?.id,
      name: form.name.trim(),
      description: form.description.trim()
    };
    if (!payload.name) return;
    if (editing) {
      update(payload);
    } else {
      add(payload);
    }
    setEditing(null);
    setForm({ name: '', description: '' });
  };

  const onDelete = (g) => {
    if (typeof window !== 'undefined' && window.confirm(`Delete attribute group "${g.name}"?`)) {
      remove(g.id);
      if (editing?.id === g.id) setEditing(null);
    }
  };

  const onExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attribute-groups.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importJson(String(reader.result || ''));
    };
    reader.readAsText(file);
    // reset input so user can import same file again if needed
    e.target.value = '';
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Attribute Groups</h1>
        <div>
          <button onClick={onExport} style={{ marginRight: 8 }}>Export JSON</button>
          <button onClick={onImportClick}>Import JSON</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={onImportFile} style={{ display: 'none' }} />
        </div>
      </div>

      {!hydrated && <div>Loading…</div>}

      {hydrated && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16 }}>
          <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>{editing ? 'Edit group' : 'Create new group'}</h3>
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Specifications"
                  style={{ width: '100%', padding: 8 }}
                  required
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                  style={{ width: '100%', padding: 8, minHeight: 60 }}
                />
              </div>
              <div>
                <button type="submit" style={{ marginRight: 8 }}>{editing ? 'Save changes' : 'Add group'}</button>
                {editing && (
                  <button type="button" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>All groups ({groups.length})</h3>
            {groups.length === 0 ? (
              <div>No attribute groups yet. Create your first group on the left.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 4px' }}>Name</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 4px' }}>Description</th>
                    <th style={{ textAlign: 'right', borderBottom: '1px solid #eee', padding: '8px 4px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g.id}>
                      <td style={{ borderBottom: '1px solid #f5f5f5', padding: '8px 4px' }}>{g.name}</td>
                      <td style={{ borderBottom: '1px solid #f5f5f5', padding: '8px 4px', color: '#555' }}>{g.description}</td>
                      <td style={{ borderBottom: '1px solid #f5f5f5', padding: '8px 4px', textAlign: 'right' }}>
                        <button onClick={() => setEditing(g)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => onDelete(g)} style={{ color: '#c00' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
