import React from 'react';
import Layout from '../../components/Layout';

export default function BulkTagsAdminPage() {
  const [skuText, setSkuText] = React.useState('');
  const [addText, setAddText] = React.useState('');
  const [removeText, setRemoveText] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function onPreview(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/products/tags/bulk-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skus: skuText,
          add: addText.split(',').map((s) => s.trim()).filter(Boolean),
          remove: removeText.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json && json.error ? json.error : 'Request failed');
      setResult(json);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Bulk Tagging Preview">
      <div style={container}>
        <h1>Bulk Tagging Preview</h1>
        <p>Paste SKUs and specify tags to add or remove. This tool previews changes and does not persist updates.</p>

        <form onSubmit={onPreview} style={form}>
          <div style={row}> 
            <label style={label}>SKUs</label>
            <textarea
              style={textarea}
              rows={6}
              value={skuText}
              onChange={(e) => setSkuText(e.target.value)}
              placeholder="One per line or separated by commas"
            />
          </div>

          <div style={row}> 
            <label style={label}>Add tags</label>
            <input
              style={input}
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              placeholder="comma,separated,tags"
            />
          </div>

          <div style={row}> 
            <label style={label}>Remove tags</label>
            <input
              style={input}
              value={removeText}
              onChange={(e) => setRemoveText(e.target.value)}
              placeholder="comma,separated,tags"
            />
          </div>

          <button type="submit" disabled={loading} style={button}>
            {loading ? 'Previewing…' : 'Preview Changes'}
          </button>
        </form>

        {error ? (
          <div style={errorBox}>{error}</div>
        ) : null}

        {result ? (
          <div style={{ marginTop: 24 }}>
            <h2>Result</h2>
            <div style={{ color: '#374151' }}>
              Matched: <strong>{result.stats.matched}</strong>, Updated: <strong>{result.stats.updated}</strong>,
              Added tags: <strong>{result.stats.added}</strong>, Removed tags: <strong>{result.stats.removed}</strong>
            </div>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>SKU</th>
                  <th style={th}>Before</th>
                  <th style={th}>After</th>
                  <th style={th}>Added</th>
                  <th style={th}>Removed</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((it) => (
                  <tr key={it.sku}>
                    <td style={td}><code>{it.sku}</code></td>
                    <td style={td}>{Array.isArray(it.before) ? it.before.join(', ') : ''}</td>
                    <td style={td}>{Array.isArray(it.after) ? it.after.join(', ') : ''}</td>
                    <td style={td}>{Array.isArray(it.added) ? it.added.join(', ') : ''}</td>
                    <td style={td}>{Array.isArray(it.removed) ? it.removed.join(', ') : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const form = { display: 'flex', flexDirection: 'column', gap: 12 };
const row = { display: 'flex', flexDirection: 'column', gap: 6 };
const label = { fontWeight: 600 };
const textarea = { width: '100%', fontFamily: 'monospace', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 };
const input = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 };
const button = { width: 'fit-content', background: '#111827', color: '#fff', border: 0, borderRadius: 6, padding: '10px 14px', cursor: 'pointer' };
const errorBox = { marginTop: 12, background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: 10, borderRadius: 6 };
const table = { width: '100%', borderCollapse: 'collapse', marginTop: 12 };
const th = { textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px' };
const td = { borderBottom: '1px solid #f3f4f6', padding: '8px 6px', verticalAlign: 'top' };
