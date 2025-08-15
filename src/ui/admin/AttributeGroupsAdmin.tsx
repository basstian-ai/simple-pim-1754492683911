import React, { useEffect, useState } from 'react';

type Group = { id: string; name: string; attributes: string[] };

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [attrs, setAttrs] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/attribute-groups')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setGroups(data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) {
          setError('Failed to load attribute groups');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const payload = { name: name.trim(), attributes: attrs.split(',').map((s) => s.trim()).filter(Boolean) };
    // optimistic UI: append temporary item
    const tempId = 'tmp-' + Math.random().toString(36).slice(2, 7);
    const temp: Group = { id: tempId, name: payload.name, attributes: payload.attributes };
    setGroups((g) => [...g, temp]);
    setName('');
    setAttrs('');

    try {
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.errors ? JSON.stringify(body.errors) : 'Create failed');
      }
      const created: Group = await res.json();
      // replace temp with real
      setGroups((g) => g.map((it) => (it.id === tempId ? created : it)));
    } catch (err: any) {
      // rollback optimistic update
      setGroups((g) => g.filter((it) => it.id !== tempId));
      setError(err?.message || 'Failed to create');
    }
  }

  async function handleDelete(id: string) {
    const prev = groups;
    setGroups((g) => g.filter((it) => it.id !== id)); // optimistic removal
    try {
      const res = await fetch(`/api/attribute-groups?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setGroups(prev); // rollback
      setError('Failed to delete');
    }
  }

  if (loading) return <div>Loading attribute groups…</div>;
  return (
    <div>
      <h2>Attribute Groups</h2>
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      <ul>
        {groups.map((g) => (
          <li key={g.id} data-testid={`group-${g.id}`}>
            <strong>{g.name}</strong> — {g.attributes.join(', ')}
            <button onClick={() => handleDelete(g.id)} aria-label={`delete-${g.id}`}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate} aria-label="create-form">
        <div>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Attributes (comma separated)
            <input value={attrs} onChange={(e) => setAttrs(e.target.value)} />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
