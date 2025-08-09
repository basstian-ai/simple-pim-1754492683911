import React from 'react';
import fs from 'fs';
import path from 'path';

export default function AttributeGroupsPage({ groups }) {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Attribute Groups</h1>
      <p style={{ color: '#555' }}>Predefined groups to organize product attributes.</p>
      {(!groups || groups.length === 0) && (
        <div>No attribute groups defined.</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {groups.map((g) => (
          <div key={g.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{g.name}</h2>
              <code style={{ color: '#6b7280' }}>{g.id}</code>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
              {g.attributes?.length || 0} attributes
            </div>
            <ul style={{ marginTop: 12, paddingLeft: 16 }}>
              {g.attributes?.map((a) => (
                <li key={a.code} style={{ marginBottom: 6 }}>
                  <strong>{a.label}</strong>
                  <span style={{ color: '#6b7280' }}> ({a.code})</span>
                  <span style={{ marginLeft: 6, background: '#f3f4f6', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}>
                    {a.type}
                  </span>
                  {a.unit ? (
                    <span style={{ marginLeft: 6, color: '#6b7280' }}>unit: {a.unit}</span>
                  ) : null}
                  {Array.isArray(a.options) && a.options.length > 0 ? (
                    <div style={{ marginTop: 2, color: '#374151', fontSize: 12 }}>
                      options: {a.options.join(', ')}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
  let groups = [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    groups = JSON.parse(raw);
  } catch (err) {
    groups = [];
  }
  return {
    props: {
      groups,
    },
  };
}
