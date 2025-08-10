import { useEffect, useState } from 'react';

export default function AttributeGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [attrsText, setAttrsText] = useState('code:label:type\ncolor:Color:select[Red|Green|Blue]');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/attribute-groups');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setGroups(json.data || []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function parseAttributes(text) {
    // Each line: code:label:type OR for select: code:label:select[Option1|Option2]
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const attrs = [];
    for (const [i, line] of lines.entries()) {
      const parts = line.split(':');
      if (parts.length < 3) throw new Error(`Line ${i + 1}: Expected format code:label:type`);
      const [code, label, typeRaw] = parts;
      let type = typeRaw;
      let options;
      const m = typeRaw.match(/^select\[(.*)\]$/i);
      if (m) {
        type = 'select';
        options = (m[1] || '')
          .split('|')
          .map((o) => o.trim())
          .filter(Boolean);
        if (options.length === 0) throw new Error(`Line ${i + 1}: select[] must include options`);
      }
      attrs.push({ code, label, type, ...(options ? { options } : {}) });
    }
    return attrs;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      setError('');
      const attributes = parseAttributes(attrsText);
      const res = await fetch('/api/attribute-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attributes }),
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details ? `: ${json.details.join('; ')}` : '';
        throw new Error(json.error ? json.error + details : 'Failed to create');
      }
      setName('');
      setAttrsText('');
      await load();
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px' }}>
      <h1>Attribute Groups</h1>

      <section style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Create New Group</h2>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>
              <div style={{ fontWeight: 600 }}>Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Specifications"
                style={{ width: '100%', padding: 8 }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              <div style={{ fontWeight: 600 }}>Attributes</div>
              <textarea
                value={attrsText}
                onChange={(e) => setAttrsText(e.target.value)}
                rows={5}
                style={{ width: '100%', padding: 8, fontFamily: 'monospace' }}
                placeholder={'code:label:type\nsize:Size:number\nis_active:Is Active:boolean\ncolor:Color:select[Red|Green|Blue]'}
              />
            </label>
            <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
              Format: code:label:type. For select, use select[Option1|Option2].
            </div>
          </div>
          <button type="submit" disabled={submitting} style={{ padding: '8px 12px' }}>
            {submitting ? 'Creating…' : 'Create Group'}
          </button>
        </form>
        {error ? (
          <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>
        ) : null}
      </section>

      <section>
        <h2 style={{ marginTop: 0 }}>Existing Groups</h2>
        {loading ? (
          <div>Loading…</div>
        ) : groups.length === 0 ? (
          <div>No attribute groups yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {groups.map((g) => (
              <li key={g.id} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>ID: {g.id}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    <span>Updated: {new Date(g.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  {g.attributes && g.attributes.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th align="left" style={{ borderBottom: '1px solid #ddd', padding: '4px 0' }}>Code</th>
                          <th align="left" style={{ borderBottom: '1px solid #ddd', padding: '4px 0' }}>Label</th>
                          <th align="left" style={{ borderBottom: '1px solid #ddd', padding: '4px 0' }}>Type</th>
                          <th align="left" style={{ borderBottom: '1px solid #ddd', padding: '4px 0' }}>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.attributes.map((a) => (
                          <tr key={a.code}>
                            <td style={{ padding: '4px 0' }}>{a.code}</td>
                            <td style={{ padding: '4px 0' }}>{a.label}</td>
                            <td style={{ padding: '4px 0' }}>{a.type}</td>
                            <td style={{ padding: '4px 0' }}>{Array.isArray(a.options) ? a.options.join(', ') : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: '#666' }}>No attributes</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
