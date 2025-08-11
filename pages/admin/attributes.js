import React, { useEffect, useState } from 'react';

function fetchJSON(url, options) {
  return fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options }).then((r) => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });
}

export default function AdminAttributesPage() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  // new group
  const [newGroupName, setNewGroupName] = useState('');

  // new attribute
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [attrName, setAttrName] = useState('');
  const [attrCode, setAttrCode] = useState('');
  const [attrType, setAttrType] = useState('text');

  function load() {
    setLoading(true);
    setError('');
    fetchJSON('/api/attributes')
      .then((data) => {
        setGroups(data.attributeGroups || []);
        if (!selectedGroupId && (data.attributeGroups || []).length) {
          setSelectedGroupId(data.attributeGroups[0].id);
        }
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleAddGroup(e) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setError('');
    fetchJSON('/api/attributes', {
      method: 'POST',
      body: JSON.stringify({ type: 'group', name: newGroupName })
    })
      .then((data) => {
        setGroups(data.attributeGroups || []);
        setNewGroupName('');
        if (!selectedGroupId && (data.attributeGroups || []).length) {
          setSelectedGroupId(data.attributeGroups[data.attributeGroups.length - 1].id);
        }
      })
      .catch((e) => setError(e.message || 'Failed to add group'));
  }

  function handleAddAttribute(e) {
    e.preventDefault();
    if (!selectedGroupId || !attrName.trim()) return;
    setError('');
    fetchJSON('/api/attributes', {
      method: 'POST',
      body: JSON.stringify({
        type: 'attribute',
        groupId: selectedGroupId,
        attribute: { name: attrName, code: attrCode, type: attrType }
      })
    })
      .then((data) => {
        setGroups(data.attributeGroups || []);
        setAttrName('');
        setAttrCode('');
      })
      .catch((e) => setError(e.message || 'Failed to add attribute'));
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1 style={{ margin: 0 }}>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Manage attribute groups and fields for your products.</p>

      {error ? (
        <div style={{ background: '#fee', color: '#900', padding: '8px 12px', borderRadius: 6, marginBottom: 12 }}>{error}</div>
      ) : null}

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 24 }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Groups</h3>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <div>
              {groups.map((g) => (
                <div key={g.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong>{g.name}</strong>
                    <small style={{ color: '#666' }}>{g.attributes.length} attrs</small>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {g.attributes.map((a) => (
                      <span key={a.id} style={{ background: '#f5f5f5', border: '1px solid #eee', padding: '2px 8px', borderRadius: 999 }}>
                        {a.name}
                        <span style={{ color: '#888' }}> · {a.type}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>Add Group</h3>
          <form onSubmit={handleAddGroup} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <input
              aria-label="Group Name"
              placeholder="e.g. Pricing"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
            />
            <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#111', color: 'white', border: 0 }}>Add</button>
          </form>

          <h3>Add Attribute</h3>
          <form onSubmit={handleAddAttribute}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#666' }}>Group</span>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                >
                  <option value="" disabled>
                    Select a group
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#666' }}>Name</span>
                <input
                  aria-label="Attribute Name"
                  placeholder="e.g. Price"
                  value={attrName}
                  onChange={(e) => setAttrName(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                />
              </label>

              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#666' }}>Code (optional)</span>
                <input
                  aria-label="Attribute Code"
                  placeholder="e.g. price"
                  value={attrCode}
                  onChange={(e) => setAttrCode(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                />
              </label>

              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#666' }}>Type</span>
                <select
                  aria-label="Attribute Type"
                  value={attrType}
                  onChange={(e) => setAttrType(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="richtext">Rich Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="select">Select</option>
                  <option value="media[]">Media List</option>
                  <option value="url">URL</option>
                </select>
              </label>

              <div>
                <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#111', color: 'white', border: 0 }} disabled={!selectedGroupId || !attrName.trim()}>
                  Add Attribute
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
