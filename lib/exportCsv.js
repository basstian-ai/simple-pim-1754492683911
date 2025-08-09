const isInStock = require('./isInStock');

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let s = String(val);
  if (s.includes('"')) s = s.replace(/"/g, '""');
  if (/[",\n]/.test(s)) s = '"' + s + '"';
  return s;
}

function getPrice(p) {
  if (p == null) return '';
  if (Object.prototype.hasOwnProperty.call(p, 'price')) return p.price;
  if (p.pricing && Object.prototype.hasOwnProperty.call(p.pricing, 'price')) return p.pricing.price;
  return '';
}

function getId(p, idx) {
  return p.id ?? p.sku ?? p.slug ?? String(idx + 1);
}

function getName(p) {
  return p.name ?? p.title ?? '';
}

function productsToCsv(products = []) {
  const headers = ['id', 'sku', 'name', 'price', 'description', 'inStock'];
  const lines = [headers.join(',')];
  products.forEach((p, idx) => {
    const row = [
      escapeCsvValue(getId(p, idx)),
      escapeCsvValue(p.sku ?? ''),
      escapeCsvValue(getName(p)),
      escapeCsvValue(getPrice(p)),
      escapeCsvValue(p.description ?? ''),
      escapeCsvValue(isInStock(p))
    ];
    lines.push(row.join(','));
  });
  return lines.join('\n');
}

module.exports = { productsToCsv };
