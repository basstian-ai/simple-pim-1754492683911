import React, { useEffect, useState } from 'react';

const TagsStatsPage = () => {
  const [data, setData] = useState({ counts: {}, top: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/tags/stats');
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load tag stats');
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Tag Stats</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        Unique tags: {Object.keys(data.counts || {}).length}
      </p>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
          {(data.top || []).map((t) => (
            <div
              key={t.tag}
              style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.5rem 0.75rem', background: '#fafafa' }}
            >
              <div style={{ fontWeight: 600 }}>{t.tag}</div>
              <div style={{ color: '#555', fontSize: 12 }}>{t.count} product{t.count === 1 ? '' : 's'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsStatsPage;
