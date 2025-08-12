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

// Export as both a function (default) and attach named properties for
// CommonJS/ESM interop. Some callers import the module as `* as csvModule`
// and expect a `.default` or `.toCsv` property — provide those shims
// so pickCsvFn in pages/api/products/export.js can reliably discover the
// CSV serializer.
module.exports = productsToCsv;
module.exports.productsToCsv = productsToCsv;
module.exports.toCsv = productsToCsv;
module.exports.exportProductsToCsv = productsToCsv;
module.exports.default = productsToCsv;
// Expose internals for easier debugging in tests (non-critical)
module.exports._impl = { escapeCsvValue, getPrice, getId, getName, isInStock };

/* Example usage compatibility:
   const csvModule = require('./lib/exportCsv');
   // csvModule -> function (products) or csvModule.default(...)
   // csvModule.productsToCsv -> function
   // csvModule.toCsv -> function
*/
