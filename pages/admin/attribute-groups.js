import React from 'react';

export default function AttributeGroupsPage() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [name, setName] = React.useState('');
  const [attributesText, setAttributesText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load');
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const attrs = attributesText
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attributes: attrs })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create');
      setName('');
      setAttributesText('');
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this attribute group?')) return;
    setError('');
    try {
      const res = await fetch(`/api/attribute-groups?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete');
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || 'Failed to delete');
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Attribute Groups</h1>

      {error ? (
        <div style={{ background: '#fee', color: '#900', padding: '8px 12px', border: '1px solid #f99', borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      ) : null}

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create new group</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Color"
              required
              style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Attributes (comma-separated)</span>
            <input
              type="text"
              value={attributesText}
              onChange={(e) => setAttributesText(e.target.value)}
              placeholder="e.g. Red, Blue, Green"
              required
              style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>
          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#111827',
                color: '#fff',
                padding: '8px 14px',
                border: 0,
                borderRadius: 4,
                cursor: 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Creating…' : 'Create group'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Existing groups</h2>
        {loading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div>No attribute groups yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {items.map((g) => (
              <li key={g.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name} <span style={{ color: '#6b7280' }}>({g.id})</span></div>
                    <div style={{ color: '#374151', marginTop: 4 }}>{Array.isArray(g.attributes) ? g.attributes.join(', ') : ''}</div>
                  </div>
                  <button onClick={() => onDelete(g.id)} style={{ background: '#dc2626', color: '#fff', border: 0, padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
