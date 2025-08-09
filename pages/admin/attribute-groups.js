import React from 'react';
const {
  loadAttributeGroups,
  saveAttributeGroups,
  generateId,
  upsertGroup,
  removeGroup,
  upsertAttribute,
  removeAttribute,
} = require('../../lib/attributeGroups');

export default function AttributeGroupsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [newGroup, setNewGroup] = React.useState({ name: '', description: '' });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const data = loadAttributeGroups();
    setGroups(Array.isArray(data) ? data : []);
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    saveAttributeGroups(groups);
  }, [groups, mounted]);

  function handleAddGroup(e) {
    e.preventDefault();
    const name = (newGroup.name || '').trim();
    if (!name) return;
    const { list } = upsertGroup(groups, { name, description: newGroup.description || '', attributes: [] });
    setGroups(list);
    setNewGroup({ name: '', description: '' });
  }

  function handleUpdateGroup(id, patch) {
    setGroups(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)));
  }

  function handleRemoveGroup(id) {
    if (!confirm('Delete this attribute group?')) return;
    setGroups(prev => removeGroup(prev, id));
  }

  function handleAddAttribute(groupId) {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const attr = { id: generateId('attr'), code: '', label: '', type: 'text', options: [] };
      return { ...g, attributes: [...(g.attributes || []), attr] };
    }));
  }

  function handleUpdateAttribute(groupId, attrId, patch) {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updated = (g.attributes || []).map(a => (a.id === attrId ? { ...a, ...patch } : a));
      return { ...g, attributes: updated };
    }));
  }

  function handleRemoveAttribute(groupId, attrId) {
    setGroups(prev => prev.map(g => (g.id === groupId ? removeAttribute(g, attrId) : g)));
  }

  if (!mounted) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ padding: 20, maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Organize product attributes into reusable groups. Data is stored locally in your browser.</p>

      <form onSubmit={handleAddGroup} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', background: '#fafafa', padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: 12, color: '#555' }}>Group name</label>
          <input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="e.g. Basic Details" required style={{ padding: 8, minWidth: 240 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 240 }}>
          <label style={{ fontSize: 12, color: '#555' }}>Description</label>
          <input value={newGroup.description} onChange={e => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="Optional" style={{ padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: '8px 12px' }}>Add group</button>
      </form>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {groups.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>No attribute groups yet. Create your first group above.</div>
        )}
        {groups.map(group => (
          <div key={group.id} style={{ border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#f7f7f7' }}>
              <input value={group.name} onChange={e => handleUpdateGroup(group.id, { name: e.target.value })} placeholder="Group name" style={{ padding: 8, flex: 1, fontWeight: 600 }} />
              <button onClick={() => handleRemoveGroup(group.id)} style={{ padding: '6px 10px', background: '#ffe9e9', border: '1px solid #f5c2c2' }}>Delete</button>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input value={group.description || ''} onChange={e => handleUpdateGroup(group.id, { description: e.target.value })} placeholder="Description (optional)" style={{ padding: 8 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <strong>Attributes</strong>
                <button onClick={() => handleAddAttribute(group.id)} style={{ padding: '6px 10px' }}>Add attribute</button>
              </div>

              {(group.attributes || []).length === 0 && (
                <div style={{ color: '#666', fontStyle: 'italic' }}>No attributes in this group yet.</div>
              )}

              {(group.attributes || []).map(attr => (
                <div key={attr.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1.5fr auto', gap: 8, alignItems: 'center' }}>
                  <input value={attr.code} onChange={e => handleUpdateAttribute(group.id, attr.id, { code: e.target.value })} placeholder="code (unique)" style={{ padding: 8 }} />
                  <input value={attr.label} onChange={e => handleUpdateAttribute(group.id, attr.id, { label: e.target.value })} placeholder="Label" style={{ padding: 8 }} />
                  <select value={attr.type || 'text'} onChange={e => handleUpdateAttribute(group.id, attr.id, { type: e.target.value })} style={{ padding: 8 }}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  {attr.type === 'select' ? (
                    <input value={(attr.options || []).join(', ')} onChange={e => handleUpdateAttribute(group.id, attr.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Options (comma separated)" style={{ padding: 8 }} />
                  ) : (
                    <div style={{ color: '#888', fontSize: 12 }}>—</div>
                  )}
                  <button onClick={() => handleRemoveAttribute(group.id, attr.id)} style={{ padding: '6px 10px', background: '#ffe9e9', border: '1px solid #f5c2c2' }}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
