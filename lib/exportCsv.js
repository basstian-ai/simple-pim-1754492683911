// Attempt to resolve isInStock flexibly so this module works whether
// lib/isInStock exports a function directly, a default export, or a named export.
// This guards against import/export interop mismatches across CJS/ESM.
let isInStockMod;
try {
  isInStockMod = require('./isInStock');
} catch (_) {
  isInStockMod = null;
}

let isInStock = null;
if (typeof isInStockMod === 'function') {
  isInStock = isInStockMod;
} else if (isInStockMod && typeof isInStockMod.isInStock === 'function') {
  isInStock = isInStockMod.isInStock;
} else if (isInStockMod && typeof isInStockMod.default === 'function') {
  isInStock = isInStockMod.default;
} else {
  // Fallback conservative implementation: try common shape checks,
  // returns boolean indicating if product appears to be in stock.
  isInStock = function (p) {
    try {
      if (p == null) return false;
      if (typeof p.inStock === 'boolean') return p.inStock;
      if (typeof p.stock === 'number') return p.stock > 0;
      if (typeof p.quantity === 'number') return p.quantity > 0;
      if (Array.isArray(p.variants)) {
        return p.variants.some((v) => {
          if (!v) return false;
          if (typeof v.inStock === 'boolean') return v.inStock;
          if (typeof v.stock === 'number') return v.stock > 0;
          if (typeof v.quantity === 'number') return v.quantity > 0;
          return false;
        });
      }
      return false;
    } catch (_) {
      return false;
    }
  };
}

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let s = String(val);
  if (s.includes('"')) s = s.replace(/"/g, '""');
  if (/[,\"\n]/.test(s)) s = '"' + s + '"';
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
  return lines.join('\n') + (lines.length ? '\n' : '');
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

