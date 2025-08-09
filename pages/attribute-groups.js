import { useEffect, useState } from 'react';

export default function AttributeGroupsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', code: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/attribute-groups');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load');
        if (mounted) setItems(data.items || []);
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

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setPosting(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
      };
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create');
      setItems((prev) => [...prev, data]);
      setForm({ name: '', code: '' });
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '32px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Create and manage attribute groups to organize product attributes (e.g., Basic, SEO, Pricing).</p>

      <section style={{ margin: '16px 0', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create group</h2>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ flex: '1 1 240px' }}>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Name</div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Basic"
                required
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </label>
            <label style={{ flex: '1 1 240px' }}>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Code (optional)</div>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="auto-generated from name if left blank"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </label>
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                type="submit"
                disabled={posting || !form.name.trim()}
                style={{ padding: '10px 14px', background: '#111827', color: 'white', border: 0, borderRadius: 6, cursor: posting ? 'not-allowed' : 'pointer' }}
              >
                {posting ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </form>
        {error ? (
          <div style={{ marginTop: 8, color: '#b91c1c' }}>{error}</div>
        ) : null}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Groups</h2>
        {loading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div>No attribute groups yet.</div>
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', padding: '8px 12px', fontWeight: 600, fontSize: 14 }}>
              <div>Name</div>
              <div>Code</div>
              <div>ID</div>
            </div>
            {items.map((g) => (
              <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 12px', borderTop: '1px solid #f3f4f6' }}>
                <div>{g.name}</div>
                <div style={{ color: '#374151', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{g.code}</div>
                <div style={{ color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.id}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
