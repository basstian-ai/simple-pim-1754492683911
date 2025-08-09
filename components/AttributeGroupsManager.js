import { useEffect, useMemo, useState } from 'react';

function sortByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

function AttributeRow({ attr, onChange, onRemove }) {
  const [local, setLocal] = useState(attr);
  useEffect(() => setLocal(attr), [attr]);
  function update(field, value) {
    const next = { ...local, [field]: value };
    setLocal(next);
    onChange && onChange(next);
  }
  return (
    <tr>
      <td style={{ padding: '4px' }}>
        <input value={local.code}
               onChange={(e) => update('code', e.target.value)}
               placeholder="code" style={{ width: '100%' }} />
      </td>
      <td style={{ padding: '4px' }}>
        <input value={local.label}
               onChange={(e) => update('label', e.target.value)}
               placeholder="label" style={{ width: '100%' }} />
      </td>
      <td style={{ padding: '4px' }}>
        <select value={local.type}
                onChange={(e) => update('type', e.target.value)}
                style={{ width: '100%' }}>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="select">Select</option>
          <option value="date">Date</option>
        </select>
      </td>
      <td style={{ padding: '4px', textAlign: 'right' }}>
        <button onClick={onRemove} title="Remove attribute">🗑️</button>
      </td>
    </tr>
  );
}

export default function AttributeGroupsManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const selected = useMemo(() => groups.find((g) => g.id === selectedId) || null, [groups, selectedId]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      const json = await res.json();
      const items = Array.isArray(json.items) ? json.items : [];
      setGroups(items);
      if (!selectedId && items.length) setSelectedId(items[0].id);
    } catch (e) {
      console.error(e);
      setError('Failed to load attribute groups');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createGroup(name) {
    const res = await fetch('/api/attribute-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Create failed');
    const created = await res.json();
    setGroups((gs) => sortByName([...gs, created]));
    setSelectedId(created.id);
  }

  async function saveGroup(g) {
    const res = await fetch(`/api/attribute-groups?id=${encodeURIComponent(g.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(g),
    });
    if (!res.ok) throw new Error('Save failed');
    const updated = await res.json();
    setGroups((gs) => sortByName(gs.map((x) => (x.id === updated.id ? updated : x))));
  }

  async function deleteGroup(id) {
    const res = await fetch(`/api/attribute-groups?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error('Delete failed');
    setGroups((gs) => gs.filter((g) => g.id !== id));
    if (selectedId === id) setSelectedId('');
  }

  function Details() {
    const [draft, setDraft] = useState(selected);
    const [saving, setSaving] = useState(false);

    useEffect(() => setDraft(selected), [selected]);

    if (!selected) return (
      <div style={{ padding: 16 }}>
        <em>Select a group to view details</em>
      </div>
    );

    function updateName(name) {
      setDraft({ ...draft, name });
    }

    function updateAttr(idx, next) {
      const attrs = [...(draft.attributes || [])];
      attrs[idx] = next;
      setDraft({ ...draft, attributes: attrs });
    }

    function removeAttr(idx) {
      const attrs = [...(draft.attributes || [])];
      attrs.splice(idx, 1);
      setDraft({ ...draft, attributes: attrs });
    }

    function addAttr() {
      const attrs = [...(draft.attributes || [])];
      attrs.push({ code: '', label: '', type: 'text' });
      setDraft({ ...draft, attributes: attrs });
    }

    async function onSave() {
      setSaving(true);
      try {
        await saveGroup(draft);
      } catch (e) {
        alert('Failed to save group');
      } finally {
        setSaving(false);
      }
    }

    return (
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Group name</div>
            <input value={draft.name} onChange={(e) => updateName(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </label>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '8px 0' }}>Attributes</h3>
            <button onClick={addAttr}>+ Add attribute</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '4px' }}>Code</th>
                <th style={{ padding: '4px' }}>Label</th>
                <th style={{ padding: '4px' }}>Type</th>
                <th style={{ padding: '4px' }}></th>
              </tr>
            </thead>
            <tbody>
              {(draft.attributes || []).map((a, idx) => (
                <AttributeRow key={idx} attr={a} onChange={(next) => updateAttr(idx, next)} onRemove={() => removeAttr(idx)} />
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    );
  }

  function Sidebar() {
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);

    async function submitCreate(e) {
      e.preventDefault();
      if (!name.trim()) return;
      setCreating(true);
      try {
        await createGroup(name.trim());
        setName('');
      } catch (e) {
        alert('Failed to create group');
      } finally {
        setCreating(false);
      }
    }

    return (
      <div style={{ padding: 16, borderRight: '1px solid #eee', height: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ marginTop: 0 }}>Attribute Groups</h3>
        <form onSubmit={submitCreate} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New group name" style={{ flex: 1, padding: 8 }} />
            <button type="submit" disabled={creating || !name.trim()}>{creating ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div style={{ color: 'crimson' }}>{error}</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sortByName(groups).map((g) => (
              <li key={g.id} style={{ padding: '6px 4px', borderRadius: 4, background: selectedId === g.id ? '#f2f6ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', flex: 1 }} onClick={() => setSelectedId(g.id)}>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{g.attributes?.length || 0} attributes</div>
                </button>
                <button onClick={() => {
                  if (confirm('Delete this attribute group?')) deleteGroup(g.id);
                }} title="Delete">🗑️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: 320, minWidth: 280 }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1 }}>
        <Details />
      </div>
    </div>
  );
}
