import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError('Failed to load dashboard');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ margin: '0 0 1rem' }}>Admin Dashboard</h1>
      {error && <div role="alert" style={{ color: '#b00020' }}>{error}</div>}
      {!stats && !error && <div>Loading…</div>}
      {stats && (
        <div>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Total products</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.totalProducts}</div>
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ fontSize: 12, color: '#666' }}>In stock</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#128a0c' }}>{stats.inStock}</div>
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Out of stock</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#b00020' }}>{stats.outOfStock}</div>
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Unique tags</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.totalTags}</div>
            </div>
          </section>

          {stats.topTags && stats.topTags.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, margin: '0.5rem 0' }}>Top tags</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {stats.topTags.map((t) => (
                  <span key={t.tag} style={{ border: '1px solid #eee', borderRadius: 999, padding: '0.25rem 0.5rem', fontSize: 12 }}>
                    {t.tag} <span style={{ color: '#666' }}>({t.count})</span>
                  </span>
                ))}
              </div>
              <div style={{ color: '#888', marginTop: '0.5rem', fontSize: 12 }}>Updated {new Date(stats.generatedAt).toLocaleString()}</div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
