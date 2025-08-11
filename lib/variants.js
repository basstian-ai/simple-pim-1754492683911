const slugify = require('./slugify');

function toOptionSlug(value) {
  return slugify(String(value || '').trim());
}

function cartesian(axes) {
  // axes: [{ code, label, options: [..] }]
  if (!Array.isArray(axes) || axes.length === 0) return [[]];
  const [first, ...rest] = axes;
  const tail = cartesian(rest);
  const combos = [];
  for (const opt of first.options || []) {
    for (const t of tail) {
      combos.push([{ axis: first, value: opt }, ...t]);
    }
  }
  return combos;
}

function generateVariants(axes, opts = {}) {
  const baseSku = String(opts.baseSku || '').trim();
  const baseName = String(opts.baseName || '').trim();
  const safeAxes = (axes || []).filter(
    (a) => a && a.code && Array.isArray(a.options) && a.options.length > 0
  );
  const rows = cartesian(safeAxes);
  const variants = rows.map((row) => {
    const optionsMap = {};
    const parts = [];
    const nameParts = [];
    for (const { axis, value } of row) {
      optionsMap[axis.code] = value;
      parts.push(toOptionSlug(value).toUpperCase());
      nameParts.push(String(value));
    }
    const sku = [baseSku, ...parts.filter(Boolean)].filter(Boolean).join('-');
    const name = [baseName, nameParts.join(' / ').trim()].filter(Boolean).join(' - ');
    return { sku, name, options: optionsMap };
  });
  return { count: variants.length, variants };
}

function summarizeOptions(optionsMap, axes = []) {
  if (!optionsMap) return '';
  const byCode = {};
  for (const a of axes) byCode[a.code] = a;
  const pairs = Object.keys(optionsMap).map((code) => {
    const label = (byCode[code] && byCode[code].label) || code;
    return `${label}: ${optionsMap[code]}`;
  });
  return pairs.join(' / ');
}

module.exports = { cartesian, generateVariants, summarizeOptions };
