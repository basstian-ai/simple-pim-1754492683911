import React, { useEffect, useMemo, useState } from 'react';

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 8 }}>
      <div style={{ fontSize: 12, color: '#555' }}>{label}</div>
      {children}
    </label>
  );
}

function Section({ title, children, actions }) {
  return (
    <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div>{actions}</div>
      </div>
      {children}
    </section>
  );
}

export default function AttributesAdminPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const selectedGroup = useMemo(() => groups.find((g) => g.id === selectedGroupId) || groups[0], [groups, selectedGroupId]);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/attributes');
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || 'Failed');
      setGroups(json.data.groups || []);
      if (!selectedGroupId && (json.data.groups || []).length > 0) {
        setSelectedGroupId(json.data.groups[0].id);
      }
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function call(op, payload = {}, method = 'POST') {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/attributes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op, ...payload })
      });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || 'Request failed');
      setGroups(json.data.groups || []);
      return json;
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGroup(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') || '').toString().trim();
    if (!name) return;
    const res = await call('addGroup', { name }, 'POST');
    if (res && res.result && res.result.id) {
      setSelectedGroupId(res.result.id);
      e.currentTarget.reset();
    }
  }

  async function handleRenameGroup(id, name) {
    if (!name || !id) return;
    await call('renameGroup', { id, name }, 'PUT');
  }

  async function handleDeleteGroup(id) {
    if (!id) return;
    const ok = window.confirm('Delete this group and all its attributes?');
    if (!ok) return;
    await call('deleteGroup', { id }, 'DELETE');
    setSelectedGroupId('');
  }

  async function handleAddAttribute(e) {
    e.preventDefault();
    if (!selectedGroup) return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') || '').toString().trim();
    const type = (fd.get('type') || 'text').toString();
    const unit = (fd.get('unit') || '').toString().trim();
    if (!name) return;
    await call('addAttribute', { groupId: selectedGroup.id, attribute: { name, type, unit: unit || undefined } }, 'POST');
    e.currentTarget.reset();
  }

  async function handleDeleteAttr(attrId) {
    if (!selectedGroup) return;
    await call('deleteAttribute', { groupId: selectedGroup.id, attrId }, 'DELETE');
  }

  function GroupSelector() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={selectedGroup ? selectedGroup.id : ''}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{ padding: 8 }}
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {selectedGroup && (
          <button onClick={() => handleDeleteGroup(selectedGroup.id)} style={{ padding: '6px 10px', background: '#fff2f0', border: '1px solid #ffccc7', color: '#cf1322' }}>
            Delete Group
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1>Attribute Groups</h1>
      {error && (
        <div style={{ background: '#fff1f0', border: '1px solid #ffa39e', color: '#a8071a', padding: 12, borderRadius: 6, marginBottom: 12 }}>{error}</div>
      )}
      {loading && <div style={{ marginBottom: 12 }}>Loading…</div>}

      <Section
        title="Groups"
        actions={<GroupSelector />}
      >
        <form onSubmit={handleAddGroup} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label="New group name">
            <input name="name" placeholder="e.g. SEO" required style={{ padding: 8, minWidth: 240 }} />
          </Field>
          <button type="submit" style={{ padding: '8px 12px' }}>Add Group</button>
        </form>
        {selectedGroup && (
          <div style={{ marginTop: 16 }}>
            <Field label="Rename selected group">
              <input
                defaultValue={selectedGroup.name}
                onBlur={(e) => handleRenameGroup(selectedGroup.id, e.target.value)}
                style={{ padding: 8, minWidth: 240 }}
              />
            </Field>
          </div>
        )}
      </Section>

      {selectedGroup && (
        <Section title={`Attributes in "+${selectedGroup.name}+"`}>
          <form onSubmit={handleAddAttribute} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Field label="Name">
              <input name="name" placeholder="e.g. SKU" required style={{ padding: 8, minWidth: 200 }} />
            </Field>
            <Field label="Type">
              <select name="type" defaultValue="text" style={{ padding: 8 }}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="select">Select</option>
              </select>
            </Field>
            <Field label="Unit (optional)">
              <input name="unit" placeholder="e.g. cm" style={{ padding: 8, width: 120 }} />
            </Field>
            <button type="submit" style={{ padding: '8px 12px' }}>Add Attribute</button>
          </form>

          <div style={{ marginTop: 16 }}>
            {selectedGroup.attributes.length === 0 ? (
              <div style={{ color: '#888' }}>No attributes yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Unit</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGroup.attributes.map((a) => (
                      <tr key={a.id}>
                        <td style={{ padding: 8 }}>
                          <input
                            defaultValue={a.name}
                            onBlur={(e) => call('updateAttribute', { groupId: selectedGroup.id, attrId: a.id, patch: { name: e.target.value } }, 'PUT')}
                            style={{ padding: 6, width: '100%' }}
                          />
                        </td>
                        <td style={{ padding: 8 }}>
                          <select
                            defaultValue={a.type}
                            onChange={(e) => call('updateAttribute', { groupId: selectedGroup.id, attrId: a.id, patch: { type: e.target.value } }, 'PUT')}
                            style={{ padding: 6 }}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="select">Select</option>
                          </select>
                        </td>
                        <td style={{ padding: 8 }}>
                          <input
                            defaultValue={a.unit || ''}
                            onBlur={(e) => call('updateAttribute', { groupId: selectedGroup.id, attrId: a.id, patch: { unit: e.target.value || undefined } }, 'PUT')}
                            placeholder="-"
                            style={{ padding: 6, width: 120 }}
                          />
                        </td>
                        <td style={{ padding: 8, textAlign: 'right' }}>
                          <button onClick={() => handleDeleteAttr(a.id)} style={{ padding: '6px 10px', background: '#fff2f0', border: '1px solid #ffccc7', color: '#cf1322' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Section>
      )}

      <div style={{ marginTop: 24, color: '#888', fontSize: 12 }}>
        Tip: This demo stores attributes in memory on the server. Deploying on serverless may reset data between cold starts.
      </div>
    </div>
  );
}
