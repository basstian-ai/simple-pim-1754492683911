import React from 'react';
import { generateSKU, parseKeyValueLines } from '../../lib/sku';

export default function SkuGeneratorPage() {
  const [name, setName] = React.useState('');
  const [attrText, setAttrText] = React.useState('color=Red\nsize=M');
  const attrs = React.useMemo(() => parseKeyValueLines(attrText), [attrText]);
  const sku = React.useMemo(() => generateSKU(name, attrs), [name, attrs]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      alert('SKU copied to clipboard');
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = sku;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('SKU copied to clipboard');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial' }}>
      <h1 style={{ marginBottom: 8 }}>SKU Generator</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Create consistent, human-friendly SKUs from product names and attributes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Product name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Red Shirt"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Attributes (key=value per line)</div>
          <textarea
            value={attrText}
            onChange={(e) => setAttrText(e.target.value)}
            rows={6}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
          />
          <div style={{ color: '#777', fontSize: 12, marginTop: 4 }}>Tip: prefix a line with # to ignore it.</div>
        </label>

        <div style={{ background: '#f7f7f8', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: '#667085', textTransform: 'uppercase', letterSpacing: 0.5 }}>Preview SKU</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4, wordBreak: 'break-all' }}>{sku || '—'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copy} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Copy</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, color: '#555' }}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>How it works</summary>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
            <p>
              The SKU is built from the first three letters of each word in the product name, followed by short codes for each attribute (two letters from the attribute name and value), and a short checksum for uniqueness.
            </p>
            <p>
              Example: "Red Shirt" with attributes color=Red and size=M becomes: <code>REDSHI-CORE-SIM-XXXX</code>.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
