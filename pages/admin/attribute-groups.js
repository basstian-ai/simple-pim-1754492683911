import { useEffect, useState } from 'react';

export default function AttributeGroupsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attribute-groups');
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
      setError('');
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create');
      }
      setName('');
      setDescription('');
      await load();
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Organize product attributes into groups.</p>

      <section style={{ margin: '24px 0', padding: 16, border: '1px solid #eaeaea', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create Group</h2>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Name (e.g. Specs)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: '1 1 240px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ flex: '2 1 320px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #111', background: '#111', color: '#fff', cursor: 'pointer', opacity: submitting || !name.trim() ? 0.6 : 1 }}
            >
              {submitting ? 'Creating…' : 'Add Group'}
            </button>
          </div>
        </form>
        {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
      </section>

      <section style={{ margin: '24px 0' }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Groups</h2>
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p>No attribute groups yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((g) => (
              <li key={g.id} style={{ border: '1px solid #eaeaea', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <strong>{g.name}</strong>
                  <code style={{ background: '#f6f6f6', padding: '2px 6px', borderRadius: 4, color: '#555' }}>{g.id}</code>
                </div>
                {g.description ? <p style={{ margin: '6px 0 0', color: '#444' }}>{g.description}</p> : null}
                <small style={{ color: '#777' }}>{Array.isArray(g.attributes) ? g.attributes.length : 0} attributes</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
