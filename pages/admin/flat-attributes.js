import React from 'react';

export default function FlatAttributesAdminPage({ attributes = [], count = 0 }) {
  return (
    <div style={container}>
      <h1 style={title}>Flat Attributes</h1>
      <p style={muted}>A flattened view of all attributes across groups. Useful for auditing and quick lookup.</p>
      <div style={summary}>Total attributes: <strong>{count}</strong></div>

      {attributes.length === 0 ? (
        <p style={muted}>No attributes found.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Code</th>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={th}>Group</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((a) => (
                <tr key={`${a.groupId}:${a.code}`}>
                  <td style={td}><code style={codeBadge}>{a.code}</code></td>
                  <td style={td}>{a.label || a.name || a.code}</td>
                  <td style={td}><span style={pill}>{a.type}</span></td>
                  <td style={td} title={String(a.groupId)}>{a.groupName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const groups = require('../../data/attribute-groups.json');
    const attributes = [];
    if (Array.isArray(groups)) {
      for (const g of groups) {
        const list = Array.isArray(g.attributes) ? g.attributes : [];
        for (const attr of list) {
          attributes.push({ ...attr, groupId: g.id, groupName: g.name });
        }
      }
    }

    // Sort by group then code for stable UI
    attributes.sort((a, b) => {
      const gn = String(a.groupName || '').localeCompare(String(b.groupName || ''));
      if (gn !== 0) return gn;
      return String(a.code || '').localeCompare(String(b.code || ''));
    });

    return { props: { attributes, count: attributes.length } };
  } catch (err) {
    console.error('flat-attributes getStaticProps error', err);
    return { props: { attributes: [], count: 0 } };
  }
}

const container = { padding: 20, maxWidth: 1000, margin: '0 auto' };
const title = { fontSize: 28, margin: '8px 0 6px' };
const summary = { marginTop: 4, color: '#111827' };
const muted = { color: '#6b7280' };
const table = { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 };
const th = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, fontSize: 14 };
const td = { padding: '10px 12px', borderBottom: '1px solid #f3f4f6', fontSize: 14 };
const pill = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const codeBadge = { background: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
