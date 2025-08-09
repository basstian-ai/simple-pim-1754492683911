import { useEffect, useState } from 'react';

export default function AttributeGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/attribute-groups');
        const json = await res.json();
        if (!mounted) return;
        if (json.ok) {
          setGroups(json.data);
        } else {
          setError(json.error || 'Failed to load');
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.code || !form.name) {
      setError('Please provide both code and name');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code.trim(), name: form.name.trim() })
      });
      const json = await res.json();
      if (json.ok) {
        setGroups((prev) => [json.data, ...prev]);
        setForm({ code: '', name: '' });
      } else {
        setError(json.error || 'Failed to create');
      }
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Organize product attributes into reusable groups.</p>

      <section style={{ margin: '16px 0', padding: '16px', border: '1px solid #eaeaea', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create New Group</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="code" style={{ fontSize: 12, color: '#555' }}>Code</label>
            <input
              id="code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g., marketing"
              style={{ padding: '8px 10px', minWidth: 200 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="name" style={{ fontSize: 12, color: '#555' }}>Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Marketing Attributes"
              style={{ padding: '8px 10px', minWidth: 260 }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '10px 14px', background: '#111', color: 'white', borderRadius: 6, border: 'none', cursor: 'pointer' }}
          >
            {submitting ? 'Creating…' : 'Add Group'}
          </button>
        </form>
        {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Groups</h2>
        {loading ? (
          <p>Loading…</p>
        ) : groups.length === 0 ? (
          <p>No attribute groups yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {groups.map((g) => (
              <li key={g.id} style={{ border: '1px solid #eaeaea', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{g.name}</strong>
                    <span style={{ color: '#888' }}> — {g.code}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#666' }}>{(g.attributes || []).length} attributes</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
