import React, { useState } from 'react';

// Simple ProductList with a Copy SKU action for each product.
// Keeps markup minimal and accessible.
const copyToClipboard = async (text) => {
  if (!text) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for environments without navigator.clipboard
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(el);
    return successful;
  } catch (e) {
    return false;
  }
};

const ProductItem = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const sku = product?.sku || product?.id || '';

  const handleCopy = async () => {
    const ok = await copyToClipboard(sku);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div
      style={{
        borderBottom: '1px solid #eee',
        padding: '0.75rem 0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      data-testid={`product-item-${sku}`}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{product?.name || sku}</div>
        {product?.description && (
          <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{product.description}</div>
        )}
        <div style={{ marginTop: 8, color: '#444', fontSize: 12 }}>
          <strong>SKU:</strong> <span data-testid={`sku-${sku}`}>{sku}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy SKU ${sku}`}
          style={{
            padding: '0.35rem 0.6rem',
            borderRadius: 6,
            border: '1px solid #ddd',
            background: copied ? '#e7f1ff' : 'white',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {copied ? 'Copied!' : 'Copy SKU'}
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products = [] }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <div style={{ color: '#666', padding: '1rem 0' }}>No products found</div>;
  }

  return (
    <div>
      {products.map((p) => (
        <ProductItem key={p.sku || p.id || p.name} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
