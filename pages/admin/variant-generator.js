import React, { useEffect, useMemo, useState } from 'react';
const variantsLib = require('../../lib/variants');

function useSelectAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/attributes');
        if (!res.ok) throw new Error('Failed to load attributes');
        const data = await res.json();
        const groups = Array.isArray(data.groups) ? data.groups : [];
        const flat = [];
        for (const g of groups) {
          for (const a of g.attributes || []) {
            if (a && a.type === 'select' && Array.isArray(a.options) && a.options.length > 0) {
              flat.push({
                code: a.code,
                label: a.label || a.code,
                options: a.options,
                groupId: g.id,
                groupName: g.name || g.id,
              });
            }
          }
        }
        if (!alive) return;
        setAttributes(flat);
      } catch (e) {
        if (!alive) return;
        setError(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  return { attributes, loading, error };
}

export default function VariantGeneratorPage() {
  const { attributes, loading, error } = useSelectAttributes();
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [baseSku, setBaseSku] = useState('SKU-BASE');
  const [baseName, setBaseName] = useState('Sample Product');

  const axes = useMemo(() => {
    const byCode = {};
    for (const a of attributes) byCode[a.code] = a;
    return selectedCodes.map((c) => byCode[c]).filter(Boolean);
  }, [attributes, selectedCodes]);

  const { variants, count } = useMemo(() => {
    return variantsLib.generateVariants(axes, { baseSku, baseName });
  }, [axes, baseSku, baseName]);

  function toggle(code) {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: 26 }}>Variant Generator</h1>
      <p style={{ color: '#555' }}>Create variant combinations from select attributes.</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Base SKU</label>
            <input value={baseSku} onChange={(e) => setBaseSku(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Base Name</label>
            <input value={baseName} onChange={(e) => setBaseName(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Select Axes</div>
          {loading && <div>Loading attributes…</div>}
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          {!loading && attributes.length === 0 && <div>No selectable attributes found.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            {attributes.map((a) => (
              <label key={a.code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                <input type="checkbox" checked={selectedCodes.includes(a.code)} onChange={() => toggle(a.code)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{a.label}</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>{a.groupName} • {a.options.length} options</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600 }}>Preview ({count} variants)</div>
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px' }}>SKU</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px' }}>Name</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px' }}>Options</th>
                </tr>
              </thead>
              <tbody>
                {variants.slice(0, 20).map((v, i) => (
                  <tr key={i}>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '8px 6px', whiteSpace: 'nowrap' }}>{v.sku}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '8px 6px' }}>{v.name}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: '8px 6px', color: '#374151' }}>{variantsLib.summarizeOptions(v.options, axes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {count > 20 && (
            <div style={{ marginTop: 6, color: '#6b7280' }}>Showing first 20 of {count} variants…</div>
          )}
        </div>
      </div>
    </div>
  );
}
