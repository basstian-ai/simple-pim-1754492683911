import React from 'react';

export default function AttributeGroupDetail({ group }) {
  if (!group) {
    return (
      <div style={container}>
        <p>No attribute group found.</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>{group.name}</h1>
        <code style={{ color: '#6b7280' }}>{group.id}</code>
      </div>
      {group.description ? (
        <p style={{ color: '#374151' }}>{group.description}</p>
      ) : null}

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, margin: '8px 0' }}>Attributes</h2>
        {Array.isArray(group.attributes) && group.attributes.length > 0 ? (
          <ul style={list}>
            {group.attributes.map((attr) => (
              <li key={attr.code} style={listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong>{attr.label || attr.name || attr.code}</strong>
                  <code style={codeBadge}>{attr.code}</code>
                  <span style={pill}>{attr.type}</span>
                  {attr.required ? <span style={requiredPill}>required</span> : <span style={optionalPill}>optional</span>}
                </div>
                {Array.isArray(attr.options) && attr.options.length > 0 ? (
                  <div style={{ marginTop: 6, color: '#374151' }}>
                    Options: {attr.options.join(', ')}
                  </div>
                ) : null}
                {attr.unit ? (
                  <div style={{ marginTop: 6, color: '#374151' }}>Unit: {attr.unit}</div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No attributes in this group.</p>
        )}
      </section>
    </div>
  );
}

const container = { padding: 20, maxWidth: 960, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 };
const listItem = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' };
const codeBadge = { background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 };
const pill = { background: '#f1f5f9', color: '#0f172a', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const requiredPill = { background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
const optionalPill = { background: '#f3f4f6', color: '#374151', padding: '2px 6px', borderRadius: 999, fontSize: 12 };
