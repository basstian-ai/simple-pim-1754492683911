import React from 'react';

export default function AttributeGroupsPage() {
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load attribute groups');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (res.status === 409) {
        const body = await res.json();
        setError(body && body.error ? body.error : 'Duplicate name');
        return;
      }
      if (!res.ok) throw new Error('Failed to save');
      setName('');
      setDescription('');
      await load();
    } catch (e) {
      setError('Failed to save attribute group');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#666' }}>Create and manage attribute groups to organize product attributes (e.g., Dimensions, Materials, Colors).</p>

      <form onSubmit={onSubmit} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            <div style={{ fontWeight: 600 }}>Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Colors"
              required
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <label>
            <div style={{ fontWeight: 600 }}>Description</div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <div>
            <button type="submit" disabled={saving} style={{ padding: '8px 14px' }}>
              {saving ? 'Saving…' : 'Add Group'}
            </button>
          </div>
          {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        </div>
      </form>

      <div>
        <h2 style={{ marginTop: '2rem' }}>Existing Groups</h2>
        {loading ? (
          <div>Loading…</div>
        ) : groups.length === 0 ? (
          <div style={{ color: '#666' }}>No attribute groups yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {groups.map((g) => (
              <li key={g.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    {g.description ? (
                      <div style={{ color: '#555' }}>{g.description}</div>
                    ) : null}
                  </div>
                  <div style={{ color: '#888', fontSize: 12 }}>
                    {new Date(g.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
