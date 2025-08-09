import React, { useEffect, useMemo, useState } from 'react';
import { readGroups, writeGroups } from '../../lib/attributes-store';

const { normalizeAttribute, validateGroup, ALLOWED_TYPES } = require('../../lib/attributes-core');

function genId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36).slice(-4)}`;
}

export default function AttributesAdmin() {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [expanded, setExpanded] = useState({});
  const [newAttrMap, setNewAttrMap] = useState({});

  useEffect(() => {
    // client-only load
    const initial = readGroups();
    setGroups(initial);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeGroups(groups);
  }, [groups, loaded]);

  const validations = useMemo(() => {
    const map = {};
    for (const g of groups) {
      map[g.id] = validateGroup(g);
    }
    return map;
  }, [groups]);

  function toggleExpand(groupId) {
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }

  function handleAddGroup() {
    const name = (newGroup.name || '').trim();
    if (!name) {
      alert('Please provide a group name');
      return;
    }
    const group = {
      id: genId('grp'),
      name,
      description: (newGroup.description || '').trim(),
      attributes: [],
    };
    setGroups((prev) => [...prev, group]);
    setNewGroup({ name: '', description: '' });
    setExpanded((prev) => ({ ...prev, [group.id]: true }));
  }

  function updateGroupField(groupId, field, value) {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, [field]: value } : g)));
  }

  function deleteGroup(groupId) {
    if (!confirm('Delete this group and all its attributes?')) return;
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  function getNewAttr(groupId) {
    return (
      newAttrMap[groupId] || {
        code: '',
        label: '',
        type: 'text',
        required: false,
        optionsText: '',
      }
    );
  }

  function setNewAttr(groupId, patch) {
    setNewAttrMap((prev) => ({ ...prev, [groupId]: { ...getNewAttr(groupId), ...patch } }));
  }

  function handleAddAttribute(groupId) {
    const form = getNewAttr(groupId);
    const normalized = normalizeAttribute({
      code: form.code,
      label: form.label,
      type: form.type,
      required: !!form.required,
      options: form.optionsText,
    });
    if (!normalized.code) {
      alert('Attribute code is required');
      return;
    }
    if (normalized.type === 'select' && (!normalized.options || normalized.options.length === 0)) {
      alert("Please provide at least one option (comma or newline separated)");
      return;
    }
    const attr = { ...normalized, id: genId('att') };
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, attributes: [...g.attributes, attr] } : g))
    );
    // clear form, keep type/required for faster entry
    setNewAttr(groupId, { code: '', label: '', optionsText: '' });
  }

  function deleteAttribute(groupId, attrId) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, attributes: g.attributes.filter((a) => a.id !== attrId) } : g
      )
    );
  }

  function exportJson() {
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

  function handleImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        // ensure ids
        const sanitized = data.map((g) => ({
          id: g.id || genId('grp'),
          name: (g.name || '').toString(),
          description: (g.description || '').toString(),
          attributes: Array.isArray(g.attributes)
            ? g.attributes.map((a) => ({ ...normalizeAttribute(a), id: a.id || genId('att') }))
            : [],
        }));
        setGroups(sanitized);
        e.target.value = '';
      } catch (err) {
        alert('Failed to import: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ maxWidth: 940, margin: '24px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>
        Define attribute groups and basic attributes (text, number, boolean, select). Data is saved to your browser localStorage.
      </p>

      <section style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Create new group</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={newGroup.name}
            onChange={(e) => setNewGroup((s) => ({ ...s, name: e.target.value }))}
            placeholder="Group name"
            style={{ flex: '1 1 240px', padding: 8 }}
          />
          <input
            value={newGroup.description}
            onChange={(e) => setNewGroup((s) => ({ ...s, description: e.target.value }))}
            placeholder="Description (optional)"
            style={{ flex: '2 1 340px', padding: 8 }}
          />
          <button onClick={handleAddGroup} style={{ padding: '8px 12px' }}>Add group</button>
          <span style={{ flex: 1 }} />
          <button onClick={exportJson} style={{ padding: '8px 12px' }}>Export JSON</button>
          <label style={{ display: 'inline-block', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}>
            Import JSON
            <input type="file" accept="application/json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </section>

      {groups.length === 0 ? (
        <div style={{ color: '#666' }}>No groups yet. Create your first group above.</div>
      ) : (
        groups.map((g) => {
          const v = validations[g.id] || { valid: true, errors: [] };
          const isOpen = !!expanded[g.id];
          return (
            <div key={g.id} style={{ border: '1px solid #ddd', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', padding: 10, borderBottom: '1px solid #eee' }}>
                <button onClick={() => toggleExpand(g.id)} style={{ padding: '6px 10px' }}>{isOpen ? '▾' : '▸'}</button>
                <input
                  value={g.name}
                  onChange={(e) => updateGroupField(g.id, 'name', e.target.value)}
                  style={{ flex: '1 1 auto', padding: 6, fontWeight: 600 }}
                />
                <input
                  value={g.description || ''}
                  placeholder="Description"
                  onChange={(e) => updateGroupField(g.id, 'description', e.target.value)}
                  style={{ flex: '2 1 auto', padding: 6 }}
                />
                <button onClick={() => deleteGroup(g.id)} style={{ padding: '6px 10px', color: '#a00', borderColor: '#e5caca' }}>Delete</button>
              </div>
              {!v.valid && (
                <div style={{ color: '#a00', background: '#fff6f6', padding: '8px 12px', borderBottom: '1px solid #f0dcdc' }}>
                  {v.errors.join(' • ')}
                </div>
              )}
              {isOpen && (
                <div style={{ padding: 12 }}>
                  {g.attributes.length === 0 ? (
                    <div style={{ color: '#666', marginBottom: 8 }}>No attributes yet.</div>
                  ) : (
                    <div style={{ marginBottom: 8 }}>
                      {g.attributes.map((a) => (
                        <div key={a.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                          <code style={{ background: '#f6f6f6', padding: '2px 6px', borderRadius: 4 }}>{a.code}</code>
                          <span style={{ minWidth: 120 }}>{a.label}</span>
                          <span style={{ color: '#555' }}>{a.type}{a.required ? ' • required' : ''}</span>
                          {a.type === 'select' && (
                            <span style={{ color: '#777' }}>options: {Array.isArray(a.options) ? a.options.join(', ') : ''}</span>
                          )}
                          <span style={{ flex: 1 }} />
                          <button onClick={() => deleteAttribute(g.id, a.id)} style={{ padding: '4px 8px', color: '#a00' }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
                    <strong style={{ display: 'block', marginBottom: 8 }}>Add attribute</strong>
                    {(() => {
                      const form = getNewAttr(g.id);
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 120px', gap: 8, alignItems: 'start' }}>
                          <input
                            value={form.code}
                            onChange={(e) => setNewAttr(g.id, { code: e.target.value })}
                            placeholder="Code (e.g. color)"
                            style={{ padding: 8 }}
                          />
                          <input
                            value={form.label}
                            onChange={(e) => setNewAttr(g.id, { label: e.target.value })}
                            placeholder="Label (e.g. Color)"
                            style={{ padding: 8 }}
                          />
                          <select
                            value={form.type}
                            onChange={(e) => setNewAttr(g.id, { type: e.target.value })}
                            style={{ padding: 8 }}
                          >
                            {ALLOWED_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 8 }}>
                            <input
                              type="checkbox"
                              checked={!!form.required}
                              onChange={(e) => setNewAttr(g.id, { required: e.target.checked })}
                            />
                            required
                          </label>
                          {form.type === 'select' && (
                            <textarea
                              value={form.optionsText}
                              onChange={(e) => setNewAttr(g.id, { optionsText: e.target.value })}
                              placeholder={"Options (comma or newline separated)"}
                              rows={3}
                              style={{ gridColumn: '1 / span 4', width: '100%', padding: 8 }}
                            />
                          )}
                          <div style={{ gridColumn: '1 / span 4', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAddAttribute(g.id)} style={{ padding: '8px 12px' }}>Add attribute</button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      <footer style={{ color: '#777', fontSize: 12, marginTop: 24 }}>
        Tip: Use Export/Import to move definitions between browsers or environments. This is a client-only demo editor.
      </footer>
    </div>
  );
}
