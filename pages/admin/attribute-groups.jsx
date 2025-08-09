import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const {
  loadGroups,
  saveGroups,
  createGroup,
  upsertGroup,
  deleteGroup,
} = require('../../lib/attributeGroups');

export default function AttributeGroupsPage() {
  const [mounted, setMounted] = useState(false);
  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', attrs: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const g = loadGroups();
      setGroups(g);
    } catch (e) {
      // ignore
    }
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) =>
      (g.name || '').toLowerCase().includes(q) ||
      (g.description || '').toLowerCase().includes(q) ||
      (g.attributes || []).some((a) => (a || '').toLowerCase().includes(q))
    );
  }, [groups, filter]);

  function resetForm() {
    setEditingId(null);
    setForm({ name: '', description: '', attrs: '' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = (form.name || '').trim();
    if (!name) return;
    const description = (form.description || '').trim();
    const attributes = (form.attrs || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      const existing = groups.find((g) => g.id === editingId);
      if (!existing) {
        resetForm();
        return;
      }
      const updated = { ...existing, name, description, attributes };
      const next = upsertGroup(updated);
      setGroups(next);
      resetForm();
    } else {
      const group = createGroup({ name, description, attributes });
      const next = upsertGroup(group);
      setGroups(next);
      resetForm();
    }
  }

  function startEdit(id) {
    const g = groups.find((x) => x.id === id);
    if (!g) return;
    setEditingId(g.id);
    setForm({ name: g.name || '', description: g.description || '', attrs: (g.attributes || []).join(', ') });
  }

  function remove(id) {
    const next = deleteGroup(id);
    setGroups(next);
    if (editingId === id) resetForm();
  }

  function importJson(text) {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) return false;
      const normalized = parsed.map((g) => ({
        id: String(g.id || ''),
        name: String(g.name || ''),
        description: String(g.description || ''),
        attributes: Array.isArray(g.attributes) ? g.attributes.map((a) => String(a)) : [],
      })).filter((g) => g.id && g.name);
      saveGroups(normalized);
      setGroups(normalized);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!mounted) return null;

  return (
    <div style={styles.page}>
      <Head>
        <title>Attribute Groups • Simple PIM</title>
      </Head>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Attribute Groups</h1>
        <p style={{ margin: '4px 0 0 0', color: '#555' }}>Group attributes to structure your catalog (e.g., "Dimensions", "Materials"). Stored locally in your browser.</p>
      </header>

      <section style={styles.section}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.h2}>{editingId ? 'Edit Group' : 'New Group'}</h2>
          <div style={styles.row}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Dimensions"
            />
          </div>
          <div style={styles.row}>
            <label style={styles.label}>Description</label>
            <input
              style={styles.input}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div style={styles.row}>
            <label style={styles.label}>Attributes</label>
            <input
              style={styles.input}
              value={form.attrs}
              onChange={(e) => setForm({ ...form, attrs: e.target.value })}
              placeholder="Comma-separated, e.g., Width, Height, Depth"
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={styles.primaryBtn}>{editingId ? 'Save Changes' : 'Add Group'}</button>
            {editingId ? (
              <button type="button" style={styles.btn} onClick={resetForm}>Cancel</button>
            ) : null}
          </div>
        </form>

        <div style={styles.card}>
          <h2 style={styles.h2}>Groups</h2>
          <div style={{ marginBottom: 8 }}>
            <input
              style={styles.input}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter groups..."
            />
          </div>
          {filtered.length === 0 ? (
            <p style={{ color: '#666' }}>No groups yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filtered.map((g) => (
                <li key={g.id} style={styles.groupItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    {g.description ? (
                      <div style={{ color: '#555', fontSize: 13 }}>{g.description}</div>
                    ) : null}
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(g.attributes || []).map((a, i) => (
                        <span key={i} style={styles.pill}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button style={styles.btn} onClick={() => startEdit(g.id)}>Edit</button>
                    <button style={styles.dangerBtn} onClick={() => remove(g.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.h2}>Import / Export</h2>
          <p style={{ color: '#555', marginTop: 0 }}>Export your groups as JSON, or import from a JSON array.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              style={styles.btn}
              onClick={() => {
                const data = JSON.stringify(groups, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'attribute-groups.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >Export JSON</button>
            <label style={{ ...styles.btn, cursor: 'pointer' }}>
              Import JSON
              <input
                type="file"
                accept="application/json,.json"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const text = await file.text();
                  const ok = importJson(text);
                  if (!ok) alert('Invalid JSON format. Expected an array of groups.');
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    marginBottom: 16,
  },
  section: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 16,
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    background: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  h2: {
    margin: '0 0 12px 0',
    fontSize: 18,
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    outline: 'none',
    width: '100%',
  },
  btn: {
    background: '#f3f4f6',
    color: '#111827',
    border: '1px solid #e5e7eb',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  primaryBtn: {
    background: '#111827',
    color: 'white',
    border: '1px solid #111827',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  dangerBtn: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  groupItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  pill: {
    fontSize: 12,
    padding: '4px 8px',
    background: '#f3f4f6',
    borderRadius: 999,
  },
};
