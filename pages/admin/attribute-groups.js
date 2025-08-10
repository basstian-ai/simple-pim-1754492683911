import React, { useEffect, useMemo, useState } from 'react';

function toSlug(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/g, '')
    .replace(/-$/g, '');
}

function validateLocal(group) {
  const g = {
    code: toSlug(group.code),
    name: (group.name || '').trim(),
    description: (group.description || '').trim()
  };
  const errors = {};
  if (!g.code) errors.code = 'Code is required';
  else if (!/^[a-z0-9_-]{2,32}$/.test(g.code)) errors.code = '2-32 chars: a-z, 0-9, -, _';
  if (!g.name) errors.name = 'Name is required';
  else if (g.name.length > 64) errors.name = 'Max 64 chars';
  if (g.description && g.description.length > 200) errors.description = 'Max 200 chars';
  return { valid: Object.keys(errors).length === 0, errors, group: g };
}

const lsKey = 'attributeGroupsLocal';

export default function AttributeGroupsAdmin() {
  const [serverGroups, setServerGroups] = useState([]);
  const [localGroups, setLocalGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load local first for instant UI
    try {
      const raw = window.localStorage.getItem(lsKey);
      if (raw) setLocalGroups(JSON.parse(raw));
    } catch (_) {}

    fetch('/api/attribute-groups')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(json => {
        setServerGroups(Array.isArray(json.groups) ? json.groups : []);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Error');
        setLoading(false);
      });
  }, []);

  const groups = useMemo(() => {
    // merge, local overrides by code
    const map = new Map();
    serverGroups.forEach(g => map.set(g.code, g));
    localGroups.forEach(g => map.set(g.code, g));
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [serverGroups, localGroups]);

  const [form, setForm] = useState({ code: '', name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'code' ? value : value }));
    if (name === 'code') {
      // live slugging preview but don't override user typing too aggressively
      // we show in helper text below
    }
  }

  function persistLocal(newLocal) {
    setLocalGroups(newLocal);
    try {
      window.localStorage.setItem(lsKey, JSON.stringify(newLocal));
    } catch (_) {}
  }

  async function onSubmit(e) {
    e.preventDefault();
    setNotice(null);
    const { valid, errors, group } = validateLocal(form);
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    if (groups.find(g => g.code === group.code)) {
      setFormErrors({ code: 'Code already exists' });
      return;
    }
    setFormErrors({});
    const newLocal = localGroups.concat([group]);
    persistLocal(newLocal);

    // Try to persist to API (best-effort)
    setSaving(true);
    try {
      const r = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
      });
      if (r.ok) {
        setNotice('Saved');
        // refresh server groups
        const json = await fetch('/api/attribute-groups').then(res => res.json());
        setServerGroups(Array.isArray(json.groups) ? json.groups : []);
      } else {
        const err = await r.json().catch(() => ({}));
        setNotice(err && err.error ? `Local only: ${err.error}` : 'Saved locally');
      }
    } catch (_) {
      setNotice('Saved locally');
    } finally {
      setSaving(false);
      setForm({ code: '', name: '', description: '' });
    }
  }

  function resetLocal() {
    persistLocal([]);
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Group your product attributes to keep your catalog tidy. New groups are saved locally and sent to the server when possible.</p>

      <section style={{ marginTop: 20, marginBottom: 30, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Create Group</h2>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label htmlFor="code" style={{ display: 'block', fontWeight: 600 }}>Code</label>
              <input id="code" name="code" value={form.code} onChange={onChange} placeholder="e.g. dimensions" style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Slug: {toSlug(form.code) || 'n/a'}</div>
              {formErrors.code && <div style={{ color: '#b00020', fontSize: 12 }}>{formErrors.code}</div>}
            </div>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontWeight: 600 }}>Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Dimensions" style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
              {formErrors.name && <div style={{ color: '#b00020', fontSize: 12 }}>{formErrors.name}</div>}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label htmlFor="description" style={{ display: 'block', fontWeight: 600 }}>Description</label>
            <textarea id="description" name="description" value={form.description} onChange={onChange} rows={3} placeholder="Optional" style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            {formErrors.description && <div style={{ color: '#b00020', fontSize: 12 }}>{formErrors.description}</div>}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" disabled={saving} style={{ padding: '8px 14px', background: '#111827', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Add Group'}</button>
            <button type="button" onClick={resetLocal} style={{ padding: '8px 14px', background: '#e5e7eb', color: '#111827', border: 0, borderRadius: 6, cursor: 'pointer' }}>Reset local changes</button>
            {notice && <span style={{ color: '#065f46' }}>{notice}</span>}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ marginTop: 0 }}>Groups ({groups.length})</h2>
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: '#b00020' }}>Error: {error}</div>}
        {!loading && groups.length === 0 && <div>No groups yet.</div>}
        {!loading && groups.length > 0 && (
          <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: 0, background: '#f9fafb', fontWeight: 600, padding: '10px 12px', borderBottom: '1px solid #eee' }}>
              <div>Code</div>
              <div>Name</div>
              <div>Description</div>
            </div>
            {groups.map(g => (
              <div key={g.code} style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: 0, padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}>{g.code}</div>
                <div>{g.name}</div>
                <div style={{ color: '#4b5563' }}>{g.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
