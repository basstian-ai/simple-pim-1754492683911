import { useEffect, useMemo, useState } from 'react';
import {
  slugify,
  validateGroup,
  loadGroupsFromLocalStorage,
  saveGroupsToLocalStorage,
  upsertGroup,
  removeGroup,
  normalizeGroup,
  exampleGroups,
} from '../../utils/attribute-groups';

export default function AttributeGroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', attributes: [] });
  const [errors, setErrors] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const initial = loadGroupsFromLocalStorage();
    setGroups(initial);
  }, []);

  useEffect(() => {
    saveGroupsToLocalStorage(groups);
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) =>
      g.name.toLowerCase().includes(q) ||
      g.slug.toLowerCase().includes(q) ||
      (g.attributes || []).some((a) => a.label.toLowerCase().includes(q) || a.code.toLowerCase().includes(q))
    );
  }, [groups, filter]);

  function resetForm() {
    setEditing(null);
    setErrors([]);
    setForm({ name: '', slug: '', attributes: [] });
  }

  function onEdit(g) {
    setEditing(g.id);
    setErrors([]);
    setForm({ name: g.name, slug: g.slug, attributes: g.attributes ? g.attributes.map((a) => ({ ...a })) : [] });
  }

  function onDelete(id) {
    if (!confirm('Delete this attribute group?')) return;
    setGroups((prev) => removeGroup(prev, id));
    if (editing === id) resetForm();
  }

  function addAttributeRow() {
    setForm((f) => ({
      ...f,
      attributes: [...(f.attributes || []), { code: '', label: '', type: 'text', options: [] }],
    }));
  }

  function updateAttributeRow(index, patch) {
    setForm((f) => {
      const next = { ...f, attributes: [...(f.attributes || [])] };
      next.attributes[index] = { ...next.attributes[index], ...patch };
      if ('label' in patch && !next.attributes[index].code) {
        next.attributes[index].code = slugify(patch.label || '');
      }
      if ('type' in patch && patch.type !== 'select') {
        next.attributes[index].options = [];
      }
      return next;
    });
  }

  function removeAttributeRow(index) {
    setForm((f) => {
      const next = { ...f, attributes: [...(f.attributes || [])] };
      next.attributes.splice(index, 1);
      return next;
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    const draft = normalizeGroup({
      id: editing || undefined,
      name: form.name,
      slug: form.slug || form.name,
      attributes: (form.attributes || []).map((a) => ({
        code: a.code,
        label: a.label,
        type: a.type,
        options: a.type === 'select' ? (a.options || []) : [],
      })),
    });
    const { ok, errors: errs } = validateGroup(draft);
    if (!ok) {
      setErrors(errs);
      return;
    }
    setGroups((prev) => upsertGroup(prev, draft));
    resetForm();
  }

  function loadExamples() {
    if (!confirm('Load example attribute groups? This will add to your current list.')) return;
    const samples = exampleGroups();
    setGroups((prev) => samples.reduce((acc, g) => upsertGroup(acc, g), prev));
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h1>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Define reusable attribute groups for products (e.g., Apparel with Color/Size).</p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <input
          placeholder="Filter groups and attributes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
        />
        <button onClick={loadExamples} style={{ padding: '8px 12px' }}>Load examples</button>
        <button onClick={resetForm} style={{ padding: '8px 12px' }}>{editing ? 'Cancel edit' : 'New group'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{editing ? 'Edit group' : 'Create group'}</h2>
          {errors.length > 0 && (
            <div style={{ background: '#fff3f3', color: '#b00000', padding: 8, borderRadius: 4, marginBottom: 12 }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600 }}>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                placeholder="e.g., Apparel"
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600 }}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                placeholder="auto-generated from name"
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Attributes</h3>
              <button type="button" onClick={addAttributeRow}>+ Add attribute</button>
            </div>

            {(form.attributes || []).length === 0 && (
              <p style={{ color: '#777', marginTop: 0 }}>No attributes yet. Add your first attribute.</p>
            )}

            {(form.attributes || []).map((a, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 1fr 32px', gap: 8, marginBottom: 8 }}>
                <input
                  value={a.label}
                  onChange={(e) => updateAttributeRow(idx, { label: e.target.value })}
                  placeholder="Label (e.g., Color)"
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <input
                  value={a.code}
                  onChange={(e) => updateAttributeRow(idx, { code: slugify(e.target.value) })}
                  placeholder="Code (e.g., color)"
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <select
                  value={a.type}
                  onChange={(e) => updateAttributeRow(idx, { type: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                </select>
                {a.type === 'select' ? (
                  <input
                    value={(a.options || []).join(', ')}
                    onChange={(e) => updateAttributeRow(idx, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    placeholder="Options (comma separated)"
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                ) : (
                  <div style={{ color: '#777', alignSelf: 'center' }}>—</div>
                )}
                <button type="button" onClick={() => removeAttributeRow(idx)} title="Remove" style={{ padding: 8 }}>✕</button>
              </div>
            ))}

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 12px' }}>{editing ? 'Save changes' : 'Create group'}</button>
              {editing && (
                <button type="button" onClick={resetForm} style={{ padding: '8px 12px' }}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: 12, background: '#fafafa', borderBottom: '1px solid #eee' }}>
              <strong>Groups ({filteredGroups.length})</strong>
            </div>
            <div>
              {filteredGroups.length === 0 && (
                <div style={{ padding: 16, color: '#777' }}>No groups yet. Create one on the left.</div>
              )}
              {filteredGroups.map((g) => (
                <div key={g.id} style={{ padding: 12, borderBottom: '1px solid #f2f2f2', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name} <span style={{ color: '#999', fontWeight: 400 }}>/ {g.slug}</span></div>
                    <div style={{ color: '#666', fontSize: 13 }}>
                      {(g.attributes || []).length} attribute{(g.attributes || []).length === 1 ? '' : 's'}
                      {(g.attributes || []).length > 0 && (
                        <>
                          : {g.attributes.slice(0, 4).map((a) => a.label).join(', ')}{g.attributes.length > 4 ? '…' : ''}
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => onEdit(g)} style={{ padding: '6px 10px' }}>Edit</button>
                  <button onClick={() => onDelete(g.id)} style={{ padding: '6px 10px' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
