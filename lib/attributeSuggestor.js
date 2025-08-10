/*
  Simple rule-based attribute suggestion from free text.
  Exposes: suggestAttributesFromText(text)
*/

const COLORS = [
  'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'beige', 'navy', 'gold', 'silver', 'gray', 'grey', 'teal', 'maroon'
];

const MATERIALS = [
  'cotton', 'wool', 'leather', 'polyester', 'metal', 'steel', 'aluminum', 'aluminium', 'plastic', 'wood', 'glass', 'silk', 'linen'
];

const SIZE_TOKENS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function uniqueBy(arr, key) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeValue(v) {
  // Keep original casing for brand-like values, lower-case for known vocab
  return v;
}

function suggestAttributesFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const original = text;
  const lower = text.toLowerCase();
  const suggestions = [];

  // Color detection
  for (const c of COLORS) {
    const re = new RegExp(`\\b${c}\\b`, 'i');
    if (re.test(text)) {
      suggestions.push({ code: 'color', name: 'Color', value: c.toLowerCase(), confidence: 0.9 });
    }
  }

  // Material detection
  for (const m of MATERIALS) {
    const re = new RegExp(`\\b${m}\\b`, 'i');
    if (re.test(text)) {
      let confidence = 0.85;
      const percRe = new RegExp(`(100%|[1-9]\\d?%)\\s*${m}`, 'i');
      if (percRe.test(text)) confidence = 0.95;
      suggestions.push({ code: 'material', name: 'Material', value: m.toLowerCase(), confidence });
    }
  }

  // Size token detection (S/M/L...)
  const sizeTokenMatch = original.match(/\b(?:size\s*:?\s*)?(XS|S|M|L|XL|XXL|XXXL)\b/i);
  if (sizeTokenMatch) {
    suggestions.push({ code: 'size', name: 'Size', value: sizeTokenMatch[1].toUpperCase(), confidence: 0.92 });
  }

  // Numeric dimensions e.g., 10 x 20 x 5 cm or 10x20x5 in
  const dimMatch = lower.match(/(\d+(?:[\.,]\d+)?)\s*[x×]\s*(\d+(?:[\.,]\d+)?)\s*[x×]\s*(\d+(?:[\.,]\d+)?)\s*(cm|mm|in|inch|inches|ft|m)\b/);
  if (dimMatch) {
    const unit = dimMatch[4];
    const nums = [dimMatch[1], dimMatch[2], dimMatch[3]].map(n => n.replace(',', '.'));
    suggestions.push({ code: 'length', name: 'Length', value: `${nums[0]} ${unit}`, confidence: 0.88 });
    suggestions.push({ code: 'width', name: 'Width', value: `${nums[1]} ${unit}`, confidence: 0.88 });
    suggestions.push({ code: 'height', name: 'Height', value: `${nums[2]} ${unit}`, confidence: 0.88 });
  }

  // Single dimension patterns: 10cm, 2 in, etc.
  const singleDims = [
    { code: 'length', name: 'Length', re: /(length|long|l)\s*[:=]?\s*(\d+(?:[\.,]\d+)?)\s*(cm|mm|in|inch|inches|ft|m)\b/i },
    { code: 'width', name: 'Width', re: /(width|wide|w)\s*[:=]?\s*(\d+(?:[\.,]\d+)?)\s*(cm|mm|in|inch|inches|ft|m)\b/i },
    { code: 'height', name: 'Height', re: /(height|high|h)\s*[:=]?\s*(\d+(?:[\.,]\d+)?)\s*(cm|mm|in|inch|inches|ft|m)\b/i },
  ];
  for (const d of singleDims) {
    const m = original.match(d.re);
    if (m) {
      suggestions.push({ code: d.code, name: d.name, value: `${m[2].replace(',', '.')} ${m[3]}`, confidence: 0.86 });
    }
  }

  // Brand detection
  // Pattern 1: Brand: Acme
  let brandMatch = original.match(/\bBrand\s*:?\s*([A-Z][A-Za-z0-9&\- ]{1,40})\b/);
  if (!brandMatch) {
    // Pattern 2: by Acme
    brandMatch = original.match(/\bby\s+([A-Z][A-Za-z0-9&\- ]{1,40})\b/);
  }
  if (brandMatch) {
    const brand = brandMatch[1].trim().replace(/\s{2,}/g, ' ');
    suggestions.push({ code: 'brand', name: 'Brand', value: normalizeValue(brand), confidence: 0.95 });
  }

  // Fallback: model/sku like patterns: SKU: ABC-123
  const skuMatch = original.match(/\b(SKU|Model)\s*:?\s*([A-Z0-9\-_.]{2,32})\b/i);
  if (skuMatch) {
    const label = skuMatch[1].toUpperCase() === 'SKU' ? 'sku' : 'model';
    suggestions.push({ code: label, name: label.toUpperCase(), value: skuMatch[2], confidence: 0.93 });
  }

  // De-duplicate by code+value
  const deduped = uniqueBy(suggestions, (s) => `${s.code}|${String(s.value).toLowerCase()}`);
  return deduped;
}

module.exports = {
  suggestAttributesFromText,
  COLORS,
  MATERIALS,
  SIZE_TOKENS,
};
