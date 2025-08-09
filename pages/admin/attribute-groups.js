import React, { useEffect, useMemo, useState } from 'react';

// Client-side Attribute Groups admin UI with localStorage persistence.
// Safe, standalone feature page: navigate to /admin/attribute-groups

const STORAGE_KEY = 'pim.attributeGroups.v1';

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const DEFAULT_GROUPS = [
  {
    id: 'grp-color',
    name: 'Color',
    code: 'color',
    attributes: [
      { id: 'attr-color', code: 'color', label: 'Color', type: 'text', required: false },
      { id: 'attr-finish', code: 'finish', label: 'Finish', type: 'select', required: false, options: ['Matte', 'Glossy'] }
    ]
  },
  {
    id: 'grp-size',
    name: 'Size & Weight',
    code: 'size',
    attributes: [
      { id: 'attr-size', code: 'size', label: 'Size', type: 'text', required: false },
      { id: 'attr-weight', code: 'weight', label: 'Weight (g)', type: 'number', required: false }
    ]
  }
];

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function saveToStorage(groups) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (_) {
    // ignore
  }
}

function AttributeGroupsEditor() {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const existing = loadFromStorage();
    if (existing && existing.length) {
      setGroups(existing);
    } else {
      setGroups(DEFAULT_GROUPS);
      saveToStorage(DEFAULT_GROUPS);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage(groups);
  }, [groups, loaded]);

  const groupCount = groups.length;

  const handleAddGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    const code = slugify(name);
    const newGroup = { id: uid('grp'), name, code, attributes: [] };
    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName('');
    setExpanded((e) => ({ ...e, [newGroup.id]: true }));
  };

  const handleDeleteGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const handleRenameGroup = (id, name) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name, code: slugify(name) } : g)));
  };

  const handleToggleExpand = (id) => {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  };

  const handleAddAttribute = (groupId, attr) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, attributes: [...g.attributes, { ...attr, id: uid('attr') }] } : g
      )
    );
  };

  const handleDeleteAttribute = (groupId, attrId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, attributes: g.attributes.filter((a) => a.id !== attrId) } : g
      )
    );
  };

  const handleUpdateAttribute = (groupId, attrId, patch) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              attributes: g.attributes.map((a) => (a.id === attrId ? { ...a, ...patch } : a))
            }
          : g
      )
    );
  };

  return (
    <div style={styles.container} data-testid="attribute-groups-page">
      <h1 style={styles.h1}>Attribute Groups</h1>
      <p style={styles.muted}>Define attribute groups and fields used by your products. Data is stored locally in your browser.</p>

      <section style={styles.card}>
        <h2 style={styles.h2}>Create Group</h2>
        <div style={styles.row}>
          <input
            data-testid="new-group-name"
            placeholder="Group name (e.g., Technical Specs)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={styles.input}
          />
          <button data-testid="add-group" onClick={handleAddGroup} style={styles.buttonPrimary}>
            Add Group
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.h2}>Groups ({groupCount})</h2>
          <button style={styles.buttonGhost} onClick={() => { saveToStorage(DEFAULT_GROUPS); setGroups(DEFAULT_GROUPS); }}>
            Reset to defaults
          </button>
        </div>
        {groups.length === 0 && <div style={styles.empty}>No groups yet. Create your first group above.</div>}
        <ul style={styles.list}>
          {groups.map((g) => (
            <li key={g.id} style={styles.listItem} data-testid={`group-${g.id}`}>
              <div style={styles.groupHeader}>
                <button
                  aria-label={expanded[g.id] ? 'Collapse' : 'Expand'}
                  onClick={() => handleToggleExpand(g.id)}
                  style={styles.disclosure}
                >
                  {expanded[g.id] ? '▾' : '▸'}
                </button>
                <input
                  style={styles.inputInline}
                  value={g.name}
                  onChange={(e) => handleRenameGroup(g.id, e.target.value)}
                  aria-label="Group name"
                />
                <span style={styles.badge}>{g.attributes.length} field{g.attributes.length === 1 ? '' : 's'}</span>
                <button style={styles.buttonDanger} onClick={() => handleDeleteGroup(g.id)}>
                  Delete
                </button>
              </div>
              {expanded[g.id] && (
                <GroupAttributes
                  group={g}
                  onAdd={(attr) => handleAddAttribute(g.id, attr)}
                  onDelete={(attrId) => handleDeleteAttribute(g.id, attrId)}
                  onUpdate={(attrId, patch) => handleUpdateAttribute(g.id, attrId, patch)}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function GroupAttributes({ group, onAdd, onDelete, onUpdate }) {
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');

  const canAdd = useMemo(() => label.trim().length > 0, [label]);

  const add = () => {
    if (!canAdd) return;
    const finalCode = slugify(code || label);
    onAdd({ code: finalCode, label: label.trim(), type, required: false });
    setCode('');
    setLabel('');
    setType('text');
  };

  return (
    <div style={styles.attributesBox}>
      {group.attributes.length === 0 && <div style={styles.empty}>No fields yet. Add one below.</div>}
      {group.attributes.map((a) => (
        <div key={a.id} style={styles.attrRow}>
          <input
            style={styles.inputSm}
            value={a.label}
            onChange={(e) => onUpdate(a.id, { label: e.target.value })}
            placeholder="Label"
            aria-label="Attribute label"
          />
          <input
            style={styles.inputSm}
            value={a.code}
            onChange={(e) => onUpdate(a.id, { code: slugify(e.target.value) })}
            placeholder="Code"
            aria-label="Attribute code"
          />
          <select
            style={styles.selectSm}
            value={a.type}
            onChange={(e) => onUpdate(a.id, { type: e.target.value })}
            aria-label="Attribute type"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="boolean">Boolean</option>
          </select>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={!!a.required}
              onChange={(e) => onUpdate(a.id, { required: !!e.target.checked })}
            />
            Required
          </label>
          <button style={styles.buttonDangerSm} onClick={() => onDelete(a.id)} aria-label="Delete attribute">
            Delete
          </button>
        </div>
      ))}

      <div style={{ ...styles.attrRow, borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
        <input
          data-testid={`new-attr-label-${group.id}`}
          style={styles.inputSm}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="New field label (e.g., Material)"
        />
        <input
          style={styles.inputSm}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code (auto from label)"
        />
        <select style={styles.selectSm} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Select</option>
          <option value="boolean">Boolean</option>
        </select>
        <button data-testid={`add-attr-${group.id}`} style={styles.buttonPrimarySm} disabled={!canAdd} onClick={add}>
          Add field
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '20px auto', padding: '0 16px', fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif' },
  h1: { fontSize: 28, margin: '16px 0' },
  h2: { fontSize: 18, margin: '8px 0' },
  muted: { color: '#666', marginBottom: 16 },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' },
  row: { display: 'flex', gap: 8 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6 },
  inputInline: { flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6, marginRight: 8, minWidth: 200 },
  inputSm: { flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6, minWidth: 120 },
  selectSm: { padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6 },
  buttonPrimary: { background: '#111827', color: '#fff', border: '1px solid #111827', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' },
  buttonPrimarySm: { background: '#111827', color: '#fff', border: '1px solid #111827', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' },
  buttonDanger: { background: '#fff', color: '#b91c1c', border: '1px solid #b91c1c', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' },
  buttonDangerSm: { background: '#fff', color: '#b91c1c', border: '1px solid #b91c1c', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' },
  buttonGhost: { background: '#fff', color: '#111827', border: '1px solid #ddd', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { borderTop: '1px solid #eee', padding: '10px 0' },
  groupHeader: { display: 'flex', alignItems: 'center', gap: 8 },
  disclosure: { border: '1px solid #ddd', background: '#fff', borderRadius: 6, padding: '2px 6px', cursor: 'pointer' },
  badge: { background: '#f3f4f6', color: '#111827', borderRadius: 999, padding: '2px 8px', fontSize: 12, marginLeft: 'auto', marginRight: 8 },
  attributesBox: { background: '#fafafa', border: '1px dashed #e5e7eb', borderRadius: 8, padding: 12, marginTop: 10 },
  attrRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 6, color: '#374151', fontSize: 14 },
  empty: { color: '#6b7280', fontStyle: 'italic', padding: '8px 0' }
};

export default function AttributeGroupsPage() {
  return <AttributeGroupsEditor />;
}
