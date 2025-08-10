import React from 'react';

function formatPrice(value, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch (e) {
    return `${currency} ${value.toFixed ? value.toFixed(2) : value}`;
  }
}

export default function PimAdminProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '12px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>PIM Admin · Products</h1>
        <span style={{ color: '#666' }}>{products.length} items</span>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>SKU</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Price</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Variants</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p.id} style={{ background: idx % 2 ? '#fff' : '#fcfcfd' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>{p.sku}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.images && p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.images[0].alt || p.name} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover', background: '#f3f4f6' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: '#f3f4f6' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>{p.categories && p.categories.join(' / ')}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' }}>{formatPrice(p.price, p.currency || 'USD')}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: '#eef2ff', color: '#3730a3', fontSize: 12 }}>
                    {Array.isArray(p.variants) ? p.variants.length : 0}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: p.status === 'active' ? '#ecfdf5' : '#fff7ed',
                      color: p.status === 'active' ? '#065f46' : '#9a3412',
                      fontSize: 12
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                  {(p.stock && typeof p.stock.available === 'number') ? p.stock.available : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
