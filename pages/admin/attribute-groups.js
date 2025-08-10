import { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', attributes: [{ code: '', label: '', type: 'text' }] });

  useEffect(() => {
    let mounted = true;
    fetch('/api/attribute-groups')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load attribute groups');
        return r.json();
      })
      .then((data) => {
        if (mounted) {
          setGroups(Array.isArray(data.groups) ? data.groups : []);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message || 'Error');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  function addAttributeRow() {
    setNewGroup((g) => ({ ...g, attributes: [...g.attributes, { code: '', label: '', type: 'text' }] }));
  }

  function updateAttr(idx, key, value) {
    setNewGroup((g) => {
      const attrs = g.attributes.slice();
      attrs[idx] = { ...attrs[idx], [key]: value };
      return { ...g, attributes: attrs };
    });
  }

  function removeAttr(idx) {
    setNewGroup((g) => ({ ...g, attributes: g.attributes.filter((_, i) => i !== idx) }));
  }

  function submitNewGroup(e) {
    e.preventDefault();
    if (!newGroup.name.trim()) return;
    const cleaned = {
      id: 'grp-' + Date.now(),
      name: newGroup.name.trim(),
      attributes: newGroup.attributes
        .filter((a) => a.code.trim() && a.label.trim())
        .map((a) => ({ code: a.code.trim(), label: a.label.trim(), type: a.type || 'text' }))
    };
    setGroups((gs) => [cleaned, ...gs]);
    setShowForm(false);
    setNewGroup({ name: '', attributes: [{ code: '', label: '', type: 'text' }] });
  }

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#666' }}>Manage how product attributes are grouped in your PIM.</p>

      <div style={{ background: '#fff7cc', padding: 12, border: '1px solid #ffe58f', borderRadius: 6, marginBottom: 16 }}>
        Note: Creating groups here updates the client view only for now. Built-in groups are served from the API.
      </div>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowForm((s) => !s)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#111', color: '#fff' }}>
          {showForm ? 'Cancel' : 'New Group'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitNewGroup} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Group Name</label>
            <input
              value={newGroup.name}
              onChange={(e) => setNewGroup((g) => ({ ...g, name: e.target.value }))}
              placeholder="e.g. SEO"
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Attributes</strong>
              <button type="button" onClick={addAttributeRow} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#fafafa' }}>+ Add</button>
            </div>
            {newGroup.attributes.map((attr, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 80px', gap: 8, marginTop: 8 }}>
                <input
                  value={attr.code}
                  onChange={(e) => updateAttr(idx, 'code', e.target.value)}
                  placeholder="code (e.g. meta_title)"
                  style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                  required
                />
                <input
                  value={attr.label}
                  onChange={(e) => updateAttr(idx, 'label', e.target.value)}
                  placeholder="Label"
                  style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                  required
                />
                <select value={attr.type} onChange={(e) => updateAttr(idx, 'type', e.target.value)} style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="richtext">Rich Text</option>
                  <option value="boolean">Boolean</option>
                  <option value="url">URL</option>
                  <option value="media">Media</option>
                  <option value="media[]">Media List</option>
                </select>
                <button type="button" onClick={() => removeAttr(idx)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', background: '#fff' }}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#0a7', color: '#fff' }}>Create Group</button>
          </div>
        </form>
      )}

      {loading && <div>Loading attribute groups…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {groups.map((g) => (
            <div key={g.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0 }}>{g.name}</h3>
                <code style={{ color: '#666' }}>{g.id}</code>
              </div>
              <div style={{ marginTop: 8, color: '#555' }}>{Array.isArray(g.attributes) ? g.attributes.length : 0} attributes</div>
              {Array.isArray(g.attributes) && g.attributes.length > 0 && (
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 6 }}>
                  <div style={{ fontWeight: 600 }}>Code</div>
                  <div style={{ fontWeight: 600 }}>Label</div>
                  <div style={{ fontWeight: 600 }}>Type</div>
                  {g.attributes.map((a) => (
                    <>
                      <div key={g.id + a.code + '-code'} style={{ fontFamily: 'monospace' }}>{a.code}</div>
                      <div key={g.id + a.code + '-label'}>{a.label}</div>
                      <div key={g.id + a.code + '-type'}><code>{a.type}</code></div>
                    </>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
