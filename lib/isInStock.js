function isInStock(p) {
  if (!p || typeof p !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(p, 'inStock')) return !!p.inStock;
  const candidates = ['stock', 'inventory', 'quantity', 'qty', 'available', 'onHand'];
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(p, key)) {
      const v = p[key];
      if (typeof v === 'number') return v > 0;
      if (typeof v === 'boolean') return v;
      const n = Number(v);
      if (!Number.isNaN(n)) return n > 0;
      if (typeof v === 'string') {
        const lower = v.toLowerCase();
        if (lower === 'true' || lower === 'yes' || lower === 'in stock') return true;
      }
    }
  }
  return false;
}

module.exports = isInStock;
module.exports.default = isInStock;
