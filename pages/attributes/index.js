import React, { useEffect, useState } from 'react';

export default function AttributesPage() {
  const [attrs, setAttrs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use an AbortController with a client-side timeout to avoid long-hanging fetches
    // (e.g. when a backend query is slow). Keeps the UI responsive.
    let mounted = true;
    const controller = new AbortController();
    const timeoutMs = 30_000; // 30 seconds
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    async function load() {
      try {
        const res = await fetch('/api/attributes', { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load attributes (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        // API may return either an array or an object with groups/attributes.
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.groups)) list = data.groups;
        else if (data && Array.isArray(data.attributes)) list = data.attributes;
        else list = [];
        setAttrs(list);
      } catch (err) {
        if (!mounted) return;
        if (err && err.name === 'AbortError') {
          setError('Request timed out after 30s');
        } else {
          setError(err.message || 'Error loading attributes');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
      clearTimeout(timer);
      try {
        controller.abort();
      } catch (_) {}
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
              {attrs.map((a) => {
                // Options in sample data may be simple strings or objects like { code, label }.
                const opts = Array.isArray(a.options)
                  ? a.options
                      .map((o) => {
                        if (o == null) return '';
                        if (typeof o === 'string') return o;
                        if (typeof o === 'object') return o.label || o.value || o.code || '';
                        return String(o);
                      })
                      .filter(Boolean)
                      .join(', ')
                  : '';

                return (
                  <tr key={a.id || a.code}>
                    <td>{a.code}</td>
                    <td>{a.label}</td>
                    <td>{a.type}</td>
                    <td>{opts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
