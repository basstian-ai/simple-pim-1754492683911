import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function AttributeGroupsAdmin() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let canceled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const params = q ? `?q=${encodeURIComponent(q)}` : '';
        const res = await fetch(`/api/attribute-groups${params}`);
        const json = await res.json();
        if (!canceled) {
          if (!res.ok || !json.ok) {
            throw new Error(json && json.error ? json.error : 'Failed to load');
          }
          setGroups(Array.isArray(json.groups) ? json.groups : []);
        }
      } catch (e) {
        if (!canceled) setError(e.message || 'Error');
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, [q]);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <Head>
        <title>Attribute Groups · Admin</title>
      </Head>
      <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: '0.25rem' }}>Organize product attributes into logical groups.</p>

      <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search groups (e.g. core, seo)"
          aria-label="Search attribute groups"
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        {q ? (
          <button onClick={() => setQ('')} style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ddd', background: '#fafafa' }}>Clear</button>
        ) : null}
      </div>

      {loading && <div style={{ color: '#666' }}>Loading…</div>}
      {error && <div style={{ color: '#c00' }}>{error}</div>}

      {!loading && !error && (
        groups.length ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {groups.map((g) => (
              <li key={g.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{g.name}</strong>
                  <span style={{ color: '#666', fontSize: 12 }}>{g.attributes?.length || 0} attrs</span>
                </div>
                {g.description ? (
                  <div style={{ color: '#555', fontSize: 14, marginTop: 4 }}>{g.description}</div>
                ) : null}
                {Array.isArray(g.attributes) && g.attributes.length ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Attributes</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {g.attributes.map((a) => (
                        <code key={a} style={{ background: '#f6f6f6', border: '1px solid #eee', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}>{a}</code>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#666' }}>No attribute groups found.</div>
        )
      )}
    </div>
  );
}
