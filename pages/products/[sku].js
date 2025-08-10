import React from 'react';

export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Product not found</h1>
        <p>We couldn't find the product you're looking for.</p>
        <a href="/" style={{ color: '#0b64d8' }}>Back to products</a>
      </div>
    );
  }

  const { name, sku, description, tags, attributes } = product;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <a href="/" style={{ color: '#0b64d8' }}>&larr; Back</a>
      <h1 style={{ margin: '0.5rem 0 0.25rem' }}>{name || sku}</h1>
      <div style={{ color: '#666', marginBottom: '0.75rem' }}>SKU: {sku}</div>
      {description && (
        <p style={{ lineHeight: 1.5 }}>{description}</p>
      )}

      {Array.isArray(tags) && tags.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: 8 }}>Tags</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tags.map((t) => (
              <span key={t} style={{ padding: '0.25rem 0.5rem', border: '1px solid #eee', borderRadius: 999, fontSize: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {attributes && typeof attributes === 'object' && Object.keys(attributes).length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: 8 }}>Attributes</h3>
          <ul>
            {Object.entries(attributes).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const all = require('../../data/products.json');
    const lookup = String(params.sku || '').toLowerCase();
    const product = Array.isArray(all)
      ? all.find((p) => String(p.sku).toLowerCase() === lookup)
      : null;

    return {
      props: { product: product || null }
    };
  } catch (e) {
    return { props: { product: null } };
  }
}
