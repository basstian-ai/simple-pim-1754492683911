'use client';

const React = require('react');
const {
  ALLOWED_TYPES,
  createAttribute,
  createGroup,
  loadGroups,
  saveGroups,
  upsertGroup,
  removeGroup,
  addAttributeToGroup,
  removeAttributeFromGroup
} = require('../lib/attributes');

function AttributeGroupsEditor() {
  const [groups, setGroups] = React.useState([]);
  const [newGroupName, setNewGroupName] = React.useState('');

  React.useEffect(() => {
    // Load once on client
    setGroups(loadGroups());
  }, []);

  React.useEffect(() => {
    // Persist on change
    saveGroups(groups);
  }, [groups]);

  function onAddGroup(e) {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;
    const g = createGroup(name);
    setGroups(prev => upsertGroup(prev, g));
    setNewGroupName('');
  }

  function onRenameGroup(id, name) {
    setGroups(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const g = next.find(x => x.id === id);
      if (g) g.name = name;
      return next;
    });
  }

  function onDeleteGroup(id) {
    if (!confirm('Delete this attribute group?')) return;
    setGroups(prev => removeGroup(prev, id));
  }

  function onAddAttribute(groupId, draft, resetDraft) {
    const name = (draft.name || '').trim();
    const code = (draft.code || name).trim();
    const type = draft.type || 'text';
    if (!name && !code) return;
    const attr = createAttribute(code || name, type, name || code);
    setGroups(prev => addAttributeToGroup(prev, groupId, attr));
    resetDraft();
  }

  function onDeleteAttribute(groupId, attrId) {
    setGroups(prev => removeAttributeFromGroup(prev, groupId, attrId));
  }

  return (
    React.createElement('div', { style: containerStyle },
      React.createElement('h1', { style: h1Style }, 'Attribute Groups'),
      React.createElement('form', { onSubmit: onAddGroup, style: addBarStyle },
        React.createElement('input', {
          type: 'text',
          placeholder: 'New group name (e.g., SEO, Shipping)',
          value: newGroupName,
          onChange: e => setNewGroupName(e.target.value),
          style: inputStyle
        }),
        React.createElement('button', { type: 'submit', style: btnPrimary }, 'Add Group')
      ),
      groups.length === 0 && React.createElement('p', null, 'No groups yet.'),
      React.createElement('div', { style: gridStyle },
        groups.map(g => React.createElement(GroupCard, {
          key: g.id,
          group: g,
          onRename: onRenameGroup,
          onDelete: onDeleteGroup,
          onAddAttribute,
          onDeleteAttribute
        }))
      )
    )
  );
}

function GroupCard({ group, onRename, onDelete, onAddAttribute, onDeleteAttribute }) {
  const [draft, setDraft] = React.useState({ name: '', code: '', type: 'text' });

  function resetDraft() {
    setDraft({ name: '', code: '', type: 'text' });
  }

  return (
    React.createElement('div', { style: cardStyle },
      React.createElement('div', { style: cardHeader },
        React.createElement('input', {
          type: 'text',
          value: group.name,
          onChange: e => onRename(group.id, e.target.value),
          style: { ...inputStyle, margin: 0, fontWeight: 600 }
        }),
        React.createElement('button', { onClick: () => onDelete(group.id), style: btnDanger }, 'Delete')
      ),
      React.createElement('div', { style: { marginTop: 8 } },
        group.attributes.length === 0 ? (
          React.createElement('p', { style: { color: '#666', margin: '8px 0' } }, 'No attributes in this group yet.')
        ) : (
          React.createElement('ul', { style: listStyle },
            group.attributes.map(a => (
              React.createElement('li', { key: a.id, style: listItemStyle },
                React.createElement('code', { style: codeBadge }, a.code),
                React.createElement('span', { style: { flex: 1, marginLeft: 8 } }, a.name),
                React.createElement('span', { style: typePill }, a.type),
                React.createElement('button', { onClick: () => onDeleteAttribute(group.id, a.id), style: btnSmall }, 'Remove')
              )
            ))
          )
        )
      ),
      React.createElement('div', { style: addAttrRow },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Attribute name',
          value: draft.name,
          onChange: e => setDraft(d => ({ ...d, name: e.target.value })),
          style: inputStyle
        }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'code (optional)',
          value: draft.code,
          onChange: e => setDraft(d => ({ ...d, code: e.target.value })),
          style: inputStyle
        }),
        React.createElement('select', {
          value: draft.type,
          onChange: e => setDraft(d => ({ ...d, type: e.target.value })),
          style: inputStyle
        },
          ALLOWED_TYPES.map(t => React.createElement('option', { key: t, value: t }, t))
        ),
        React.createElement('button', {
          onClick: () => onAddAttribute(group.id, draft, resetDraft),
          style: btnPrimary
        }, 'Add Attribute')
      )
    )
  );
}

// Styles
const containerStyle = { padding: 20, maxWidth: 960, margin: '0 auto' };
const h1Style = { fontSize: 28, margin: '8px 0 16px' };
const addBarStyle = { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 };
const cardStyle = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const cardHeader = { display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' };
const listStyle = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 };
const listItemStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: '1px solid #eee', borderRadius: 6 };
const inputStyle = { flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, outline: 'none' };
const btnPrimary = { padding: '8px 12px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnDanger = { padding: '6px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnSmall = { padding: '4px 8px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' };
const addAttrRow = { display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 };
const codeBadge = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const typePill = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 999, fontSize: 12 };

module.exports = AttributeGroupsEditor;
