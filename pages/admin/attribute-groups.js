import { useEffect, useMemo, useState } from 'react';

export default function AttributeGroupsAdminPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && attributes.trim().length > 0 && !submitting;
  }, [name, attributes, submitting]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/attribute-groups');
        if (!res.ok) throw new Error('Failed to load attribute groups');
        const data = await res.json();
        if (mounted) setGroups(data.groups || []);
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

  async function addGroup(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attributes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data && data.errors ? data.errors.join(', ') : (data.error || 'Failed to create');
        throw new Error(msg);
      }
      setGroups((prev) => [data.group, ...prev]);
      setName('');
      setAttributes('');
    } catch (e) {
      setError(e.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteGroup(id) {
    if (!id) return;
    const confirm = window.confirm('Delete this attribute group?');
    if (!confirm) return;
    try {
      const res = await fetch('/api/attribute-groups?id=' + encodeURIComponent(id), {
        method: 'DELETE',
      });
      if (res.status === 204) {
        setGroups((prev) => prev.filter((g) => g.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error((data && data.error) || 'Failed to delete');
      }
    } catch (e) {
      setError(e.message || 'Failed to delete');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Define and manage reusable product attribute groups (e.g., Dimensions, Materials).</p>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create New Group</h2>
        <form onSubmit={addGroup}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ flex: '1 1 240px' }}>
              <div style={{ fontSize: 12, color: '#555' }}>Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dimensions"
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
              />
            </label>
            <label style={{ flex: '2 1 360px' }}>
              <div style={{ fontSize: 12, color: '#555' }}>Attributes (comma or newline separated)</div>
              <textarea
                value={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                placeholder={'e.g.\nWidth\nHeight\nDepth'}
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6, resize: 'vertical' }}
              />
            </label>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                background: canSubmit ? '#111827' : '#9ca3af',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? 'Adding…' : 'Add Group'}
            </button>
            {error ? <span style={{ color: '#b91c1c' }}>{error}</span> : null}
          </div>
        </form>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Existing Groups</h2>
          {loading ? <span style={{ color: '#6b7280' }}>Loading…</span> : null}
        </div>
        {(!groups || groups.length === 0) && !loading ? (
          <div style={{ padding: 16, color: '#6b7280' }}>No attribute groups yet. Create one above.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
            {groups.map((g) => (
              <li key={g.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>{g.attributes && g.attributes.length ? g.attributes.join(', ') : '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => deleteGroup(g.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
                      aria-label={`Delete ${g.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>ID: {g.id}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
