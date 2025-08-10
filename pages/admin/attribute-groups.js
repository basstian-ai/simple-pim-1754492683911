import fs from 'fs';
import path from 'path';

export default function AdminAttributeGroups({ groups }) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Read-only list of attribute groups powering product information. Data served from data/attribute-groups.json.
      </p>
      <div style={{ margin: '16px 0' }}>
        <a href="/api/attribute-groups" style={{ color: '#0366d6' }}>View JSON API</a>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Attributes</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td style={tdStyleMono}>{g.id}</td>
                <td style={tdStyle}>{g.name}</td>
                <td style={tdStyle}>
                  <div style={{ color: '#555' }}>{g.attributes.length} total</div>
                  <div style={{ marginTop: 4 }}>
                    {g.attributes.map((a) => (
                      <span key={a.code} style={chipStyle} title={`${a.label} (${a.type})`}>
                        {a.label}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  borderBottom: '1px solid #eaeaea',
  padding: '8px 12px',
  fontSize: 13,
  color: '#666',
  letterSpacing: 0.2,
  textTransform: 'uppercase'
};

const tdStyle = {
  borderBottom: '1px solid #f0f0f0',
  padding: '12px'
};

const tdStyleMono = {
  ...tdStyle,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: 13,
  color: '#333'
};

const chipStyle = {
  display: 'inline-block',
  padding: '2px 8px',
  marginRight: 6,
  marginBottom: 6,
  borderRadius: 12,
  background: '#f2f4f7',
  color: '#333',
  fontSize: 12
};

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  return { props: { groups: data.groups || [] } };
}
