import React, { useEffect, useState } from 'react';

export default function AttributesPage() {
  const [attrs, setAttrs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/attributes')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load attributes');
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setAttrs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Error loading attributes');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Attributes</h1>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        attrs.length === 0 ? (
          <p>No attributes found.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Label</th>
                <th>Type</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {attrs.map((a) => (
                <tr key={a.id || a.code}>
                  <td>{a.code}</td>
                  <td>{a.label}</td>
                  <td>{a.type}</td>
                  <td>{Array.isArray(a.options) ? a.options.join(', ') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
