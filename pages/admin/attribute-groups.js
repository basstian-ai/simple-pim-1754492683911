import React, { useEffect, useMemo, useState } from 'react';

const { normalizeAttributes, validateAttributeGroup, upsertGroup } = require('../../lib/attributeGroups');

const STORAGE_KEY = 'pim:attributeGroups';

function safeLoad() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn('Failed to load attribute groups from localStorage', e);
    return [];
  }
}

function safeSave(groups) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.warn('Failed to save attribute groups to localStorage', e);
  }
}

export default function AttributeGroupsAdminPage() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [attrsInput, setAttrsInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setGroups(safeLoad());
  }, []);

  useEffect(() => {
    // Persist whenever groups change (client only)
    safeSave(groups);
  }, [groups]);

  const previewAttributes = useMemo(() => normalizeAttributes(attrsInput), [attrsInput]);

  function resetForm() {
    setName('');
    setAttrsInput('');
    setErrors([]);
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = (name || '').trim();
    const attrs = normalizeAttributes(attrsInput);

    const base = editingId
      ? groups.find((g) => g.id === editingId) || {}
      : {};

    const group = {
      id: editingId || String(Date.now()),
      name: trimmedName,
      attributes: attrs,
      createdAt: base.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const errs = validateAttributeGroup(
      group,
      groups.filter((g) => g.id !== editingId)
    );

    if (errs.length) {
      setErrors(errs);
      return;
    }

    const next = upsertGroup(groups, group);
    setGroups(next);
    resetForm();
  }

  function handleEdit(g) {
    setEditingId(g.id);
    setName(g.name);
    setAttrsInput(g.attributes.map((a) => a.name).join(', '));
    setErrors([]);
  }

  function handleDelete(id) {
    if (typeof window !== 'undefined' && !window.confirm('Delete this attribute group?')) return;
    const next = groups.filter((g) => g.id !== id);
    setGroups(next);
  }

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [groups]
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Attribute Groups</h1>
        <p style={{ color: '#666', marginTop: 6 }}>Define reusable attribute groups to enrich your products (e.g., Dimensions, Materials, SEO).</p>
      </div>

      <div style={styles.layout}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>{editingId ? 'Edit Group' : 'Create Group'}</h2>
          {errors.length > 0 && (
            <div style={styles.errorBox}>
              {errors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Group name
              <input
                style={styles.input}
                type="text"
                placeholder="e.g., Dimensions"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Attributes (comma, semicolon or newline separated)
              <textarea
                style={{ ...styles.input, minHeight: 86 }}
                placeholder={"e.g.,\nWidth, Height, Depth"}
                value={attrsInput}
                onChange={(e) => setAttrsInput(e.target.value)}
              />
            </label>

            <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
              Preview: {previewAttributes.length} attribute{previewAttributes.length === 1 ? '' : 's'}
              {previewAttributes.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {previewAttributes.map((a) => (
                    <span key={a.name} style={styles.chip}>{a.name}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button style={styles.primaryBtn} type="submit">{editingId ? 'Save Changes' : 'Create Group'}</button>
              {editingId && (
                <button type="button" style={styles.secondaryBtn} onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Existing Groups</h2>
          {sortedGroups.length === 0 ? (
            <div style={{ color: '#666' }}>No attribute groups yet. Create your first one on the left.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sortedGroups.map((g) => (
                <li key={g.id} style={styles.listItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {g.attributes.map((a) => (
                        <span key={a.name} style={styles.chipSmall}>{a.name}</span>
                      ))}
                    </div>
                    <div style={{ color: '#888', fontSize: 12, marginTop: 6 }}>
                      {g.attributes.length} attribute{g.attributes.length === 1 ? '' : 's'} • Created {new Date(g.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.smallBtn} onClick={() => handleEdit(g)}>Edit</button>
                    <button style={styles.smallDangerBtn} onClick={() => handleDelete(g.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer style={{ color: '#888', fontSize: 12, marginTop: 24 }}>
        Data is stored locally in your browser for this prototype. Integrate with your backend to share across users.
      </footer>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1000,
    margin: '24px auto',
    padding: '0 16px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial',
  },
  header: {
    marginBottom: 16,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    background: 'white',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: 18,
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
  },
  primaryBtn: {
    background: '#111827',
    color: 'white',
    border: '1px solid #111827',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    background: 'white',
    color: '#111827',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  smallBtn: {
    background: 'white',
    color: '#111827',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 13,
  },
  smallDangerBtn: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 13,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  listItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    border: '1px solid #f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  chip: {
    background: '#eef2ff',
    color: '#3730a3',
    padding: '4px 8px',
    borderRadius: 999,
    fontSize: 12,
  },
  chipSmall: {
    background: '#f3f4f6',
    color: '#374151',
    padding: '3px 8px',
    borderRadius: 999,
    fontSize: 12,
  },
};
