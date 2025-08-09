import React from 'react';

export default function AttributeGroupList({ groups }) {
  if (!groups || groups.length === 0) {
    return <p>No attribute groups defined.</p>;
  }

  return (
    <div>
      {groups.map((group) => (
        <div key={group.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{group.name}</h2>
            <code style={{ color: '#6b7280' }}>{group.id}</code>
          </div>
          {group.description ? (
            <p style={{ color: '#374151', marginTop: 8 }}>{group.description}</p>
          ) : null}
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 12 }}>
            {group.attributes.map((attr) => (
              <li key={attr.code} style={{ padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{attr.label}</strong>
                    <span style={{ marginLeft: 8, color: '#6b7280' }}>({attr.code})</span>
                  </div>
                  <span style={{ fontSize: 12, padding: '2px 6px', background: '#eef2ff', color: '#3730a3', borderRadius: 6 }}>
                    {attr.type}
                  </span>
                </div>
                {Array.isArray(attr.options) && attr.options.length > 0 ? (
                  <div style={{ marginTop: 6, color: '#374151' }}>
                    Options: {attr.options.join(', ')}
                  </div>
                ) : null}
                {attr.unit ? (
                  <div style={{ marginTop: 6, color: '#374151' }}>Unit: {attr.unit}</div>
                ) : null}
                {attr.required ? (
                  <div style={{ marginTop: 6, color: '#059669' }}>Required</div>
                ) : (
                  <div style={{ marginTop: 6, color: '#6b7280' }}>Optional</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
