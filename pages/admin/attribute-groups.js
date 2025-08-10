import React, { useEffect, useState } from 'react';

export default function AttributeGroupsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, description: form.description })
      });
      if (!res.ok) throw new Error('Failed to create');
      setForm({ name: '', description: '' });
      await load();
    } catch (e) {
      alert(e.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this attribute group?')) return;
    try {
      const res = await fetch(`/api/attribute-groups?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await load();
    } catch (e) {
      alert(e.message || 'Error');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px' }}>
      <h1>Attribute Groups</h1>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Create New Group</h2>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
            style={{ flex: '1 1 220px', padding: 8 }}
          />
          <input
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={onChange}
            style={{ flex: '2 1 320px', padding: 8 }}
          />
          <button type="submit" disabled={submitting} style={{ padding: '8px 12px' }}>
            {submitting ? 'Creating…' : 'Add Group'}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ marginTop: 0 }}>Existing Groups</h2>
        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : items.length === 0 ? (
          <div>No attribute groups yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((g) => (
              <li key={g.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    {g.description ? <div style={{ color: '#6b7280' }}>{g.description}</div> : null}
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>ID: {g.id}</div>
                  </div>
                  <div>
                    <button onClick={() => onDelete(g.id)} style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 0, borderRadius: 6 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
