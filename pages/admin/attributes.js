import React, { useEffect, useMemo, useState } from 'react';

const LOCAL_KEY = 'pim:attributeGroups';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function newAttribute() {
  return { code: '', label: '', type: 'text', options: [], unit: '' };
}

function newGroup() {
  return { id: '', name: '', attributes: [newAttribute()] };
}

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loadedFrom, setLoadedFrom] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError('');
      setMessage('');
      try {
        const local = typeof window !== 'undefined' ? window.localStorage.getItem(LOCAL_KEY) : null;
        if (local) {
          const parsed = JSON.parse(local);
          setGroups(parsed);
          setLoadedFrom('local');
        } else {
          const res = await fetch('/api/attributes');
          if (!res.ok) throw new Error('Failed to load sample attributes');
          const data = await res.json();
          setGroups(Array.isArray(data.groups) ? data.groups : []);
          setLoadedFrom('server');
        }
      } catch (e) {
        setError(e.message || 'Failed to initialize');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const groupIds = useMemo(() => new Set(groups.map((g) => g.id)), [groups]);

  function updateGroup(index, updater) {
    setGroups((prev) => {
      const next = [...prev];
      next[index] = updater({ ...next[index] });
      return next;
    });
  }

  function addGroup() {
    setGroups((prev) => [...prev, newGroup()]);
  }

  function removeGroup(index) {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }

  function addAttributeToGroup(gIndex) {
    updateGroup(gIndex, (g) => ({ ...g, attributes: [...(g.attributes || []), newAttribute()] }));
  }

  function removeAttributeFromGroup(gIndex, aIndex) {
    updateGroup(gIndex, (g) => ({ ...g, attributes: (g.attributes || []).filter((_, i) => i !== aIndex) }));
  }

  function saveLocal() {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(groups));
      setLoadedFrom('local');
      setMessage('Saved to local device.');
    } catch (e) {
      setError('Failed to save locally');
    }
  }

  async function resetFromServer() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/attributes');
      if (!res.ok) throw new Error('Failed to load sample');
      const data = await res.json();
      setGroups(Array.isArray(data.groups) ? data.groups : []);
      setLoadedFrom('server');
    } catch (e) {
      setError(e.message || 'Failed to reset');
    } finally {
      setLoading(false);
    }
  }

  function handleNameChange(i, name) {
    updateGroup(i, (g) => {
      const id = g.id || slugify(name);
      return { ...g, name, id };
    });
  }

  function handleIdChange(i, id) {
    updateGroup(i, (g) => ({ ...g, id: slugify(id) }));
  }

  function handleAttrChange(gi, ai, field, value) {
    updateGroup(gi, (g) => {
      const attrs = [...(g.attributes || [])];
      const next = { ...attrs[ai], [field]: value };
      // Keep code slug-like
      if (field === 'label' && !next.code) {
        next.code = slugify(value);
      }
      if (field === 'type' && value !== 'select') {
        next.options = [];
      }
      attrs[ai] = next;
      return { ...g, attributes: attrs };
    });
  }

  function addOption(gi, ai) {
    updateGroup(gi, (g) => {
      const attrs = [...(g.attributes || [])];
      const a = { ...attrs[ai] };
      a.options = Array.isArray(a.options) ? [...a.options, ''] : [''];
      attrs[ai] = a;
      return { ...g, attributes: attrs };
    });
  }

  function updateOption(gi, ai, oi, val) {
    updateGroup(gi, (g) => {
      const attrs = [...(g.attributes || [])];
      const a = { ...attrs[ai] };
      const opts = Array.isArray(a.options) ? [...a.options] : [];
      opts[oi] = val;
      a.options = opts;
      attrs[ai] = a;
      return { ...g, attributes: attrs };
    });
  }

  function removeOption(gi, ai, oi) {
    updateGroup(gi, (g) => {
      const attrs = [...(g.attributes || [])];
      const a = { ...attrs[ai] };
      const opts = Array.isArray(a.options) ? a.options.filter((_, i) => i !== oi) : [];
      a.options = opts;
      attrs[ai] = a;
      return { ...g, attributes: attrs };
    });
  }

  const headerNote = loadedFrom === 'local' ? 'Loaded from local device' : loadedFrom === 'server' ? 'Loaded from server sample' : '';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ fontSize: 26, margin: 0 }}>Attribute Groups</h1>
      <div style={{ color: '#555', marginTop: 4 }}>{headerNote}</div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={addGroup} style={{ padding: '8px 12px', background: '#111827', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Add Group</button>
        <button onClick={saveLocal} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Save (local)</button>
        <button onClick={resetFromServer} style={{ padding: '8px 12px', background: '#6b7280', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Reset to Server Sample</button>
      </div>

      {loading && <div style={{ marginTop: 16 }}>Loading…</div>}
      {error && <div style={{ marginTop: 16, color: '#b91c1c' }}>{error}</div>}
      {message && <div style={{ marginTop: 16, color: '#065f46' }}>{message}</div>}

      <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <input
                placeholder="Group name"
                value={g.name}
                onChange={(e) => handleNameChange(gi, e.target.value)}
                style={{ flex: 2, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
              <input
                placeholder="group-id"
                value={g.id}
                onChange={(e) => handleIdChange(gi, e.target.value)}
                style={{ flex: 1, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
              <button onClick={() => addAttributeToGroup(gi)} style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Add Attribute</button>
              <button onClick={() => removeGroup(gi)} style={{ padding: '8px 12px', background: '#ef4444', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Remove Group</button>
            </div>
            {groupIds.has(g.id) || !g.id ? null : (
              <div style={{ color: '#b45309', marginBottom: 8 }}>Duplicate group id detected</div>
            )}

            <div style={{ display: 'grid', gap: 12 }}>
              {(g.attributes || []).map((a, ai) => (
                <div key={ai} style={{ padding: 12, background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                    <input
                      placeholder="Label"
                      value={a.label}
                      onChange={(e) => handleAttrChange(gi, ai, 'label', e.target.value)}
                      style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    />
                    <input
                      placeholder="code"
                      value={a.code}
                      onChange={(e) => handleAttrChange(gi, ai, 'code', slugify(e.target.value))}
                      style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    />
                    <select
                      value={a.type || 'text'}
                      onChange={(e) => handleAttrChange(gi, ai, 'type', e.target.value)}
                      style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <input
                      placeholder="Unit (optional)"
                      value={a.unit || ''}
                      onChange={(e) => handleAttrChange(gi, ai, 'unit', e.target.value)}
                      style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    />
                    <button onClick={() => removeAttributeFromGroup(gi, ai)} style={{ padding: '8px 12px', background: '#ef4444', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Remove</button>
                  </div>
                  {a.type === 'select' && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <strong>Options</strong>
                        <button onClick={() => addOption(gi, ai)} style={{ padding: '4px 8px', background: '#111827', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Add Option</button>
                      </div>
                      <div style={{ display: 'grid', gap: 6 }}>
                        {(a.options || []).map((opt, oi) => (
                          <div key={oi} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                            <input
                              placeholder={`Option ${oi + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(gi, ai, oi, e.target.value)}
                              style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                            />
                            <button onClick={() => removeOption(gi, ai, oi)} style={{ padding: '8px 12px', background: '#6b7280', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
