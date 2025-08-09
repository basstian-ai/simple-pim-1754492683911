import { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ code: '', name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      const json = await res.json();
      if (!res.ok) throw new Error('Failed to load');
      setGroups(json.data || []);
    } catch (e) {
      setError('Failed to load attribute groups');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormErrors(json.errors || { _form: 'Save failed' });
      } else {
        setForm({ code: '', name: '', description: '' });
        await load();
      }
    } catch (e) {
      setFormErrors({ _form: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#555' }}>
        Define logical groupings of product attributes (e.g., "Dimensions", "Materials").
      </p>

      <section style={{ margin: '24px 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Create new group</h2>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label htmlFor="code" style={{ display: 'block', fontWeight: 600 }}>Code</label>
              <input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. dimensions"
                style={{ width: '100%', padding: 8 }}
              />
              {formErrors.code && (
                <div style={{ color: 'crimson', fontSize: 12 }}>{formErrors.code}</div>
              )}
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <label htmlFor="name" style={{ display: 'block', fontWeight: 600 }}>Name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dimensions"
                style={{ width: '100%', padding: 8 }}
              />
              {formErrors.name && (
                <div style={{ color: 'crimson', fontSize: 12 }}>{formErrors.name}</div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label htmlFor="description" style={{ display: 'block', fontWeight: 600 }}>Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description"
              rows={3}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          {formErrors._form && (
            <div style={{ color: 'crimson', marginTop: 8 }}>{formErrors._form}</div>
          )}
          <div style={{ marginTop: 12 }}>
            <button disabled={submitting} type="submit">
              {submitting ? 'Saving…' : 'Create group'}
            </button>
          </div>
        </form>
      </section>

      <section style={{ margin: '24px 0' }}>
        <h2 style={{ marginTop: 0 }}>Existing groups</h2>
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        {!loading && groups.length === 0 && <div>No groups yet.</div>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {groups.map((g) => (
            <li key={g.id} style={{
              border: '1px solid #eee',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>{g.name} <span style={{ color: '#999', fontWeight: 400 }}>({g.code})</span></div>
                {g.description && (
                  <div style={{ color: '#666', marginTop: 4 }}>{g.description}</div>
                )}
              </div>
              <small style={{ color: '#999' }}>Updated {new Date(g.updatedAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
