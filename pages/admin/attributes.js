import React, { useEffect, useMemo, useState } from 'react';

function groupBy(arr, keyFn) {
  return (arr || []).reduce((acc, item) => {
    const k = keyFn(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

export default function AdminAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [draft, setDraft] = useState({ code: '', label: '', type: 'text', group: '' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/attributes');
        if (!res.ok) throw new Error('Failed to load attributes');
        const data = await res.json();
        if (!cancelled) setAttributes(Array.isArray(data.attributes) ? data.attributes : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error loading attributes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => groupBy(attributes, a => a.group || 'Ungrouped'), [attributes]);

  function onDraftChange(e) {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  }

  function addDraftAttribute(e) {
    e.preventDefault();
    // client-side only; not persisted on server
    if (!draft.code || !draft.label) return;
    const exists = attributes.some(a => a.code === draft.code);
    if (exists) {
      alert('Attribute code must be unique');
      return;
    }
    setAttributes(prev => [...prev, { ...draft }]);
    setDraft({ code: '', label: '', type: 'text', group: '' });
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 0 }}>Attribute Manager</h1>
      <p style={{ color: '#666', marginTop: 4 }}>Manage basic product attributes and groups. Changes made here are not persisted (demo).</p>

      <section style={{ margin: '16px 0', padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Add Attribute (local only)</h2>
        <form onSubmit={addDraftAttribute} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Code</span>
            <input name="code" value={draft.code} onChange={onDraftChange} placeholder="e.g. sku" required style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Label</span>
            <input name="label" value={draft.label} onChange={onDraftChange} placeholder="e.g. SKU" required style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Type</span>
            <select name="type" value={draft.type} onChange={onDraftChange} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Group</span>
            <input name="group" value={draft.group} onChange={onDraftChange} placeholder="e.g. Basics" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="submit" style={{ padding: '8px 12px', background: '#111827', color: 'white', border: 0, borderRadius: 4, cursor: 'pointer' }}>Add</button>
            <span style={{ fontSize: 12, color: '#888' }}>Note: demo only. This does not save to the server.</span>
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Attributes</h2>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {!loading && !error && Object.keys(grouped).length === 0 && <p>No attributes found.</p>}
        {!loading && !error && Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>{group} <span style={{ color: '#888', fontWeight: 400 }}>({items.length})</span></h3>
            <div style={{ border: '1px solid #eee', borderRadius: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '8px 12px', background: '#fafafa', color: '#555', fontSize: 12 }}>
                <div>Code</div>
                <div>Label</div>
                <div>Type</div>
                <div>Options</div>
              </div>
              {items.map(attr => (
                <div key={attr.code} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 12px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{attr.code}</div>
                  <div>{attr.label}</div>
                  <div>{attr.type}</div>
                  <div style={{ color: '#666' }}>{Array.isArray(attr.options) ? attr.options.join(', ') : '—'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
