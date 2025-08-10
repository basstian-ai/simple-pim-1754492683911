/*
  Simple attribute suggestion engine for PIM
  Heuristically extracts attributes such as Color, Size, Material, Country of Origin, Weight, Dimensions, Brand, Gender, Age Group
*/

const COLORS = [
  'black','white','red','green','blue','yellow','purple','violet','orange','pink','brown','grey','gray',
  'beige','ivory','navy','teal','turquoise','maroon','gold','silver','bronze','cream','khaki'
];

const MATERIALS = [
  'cotton','polyester','leather','wool','silk','linen','cashmere','denim','nylon','acrylic','spandex','elastane',
  'rubber','plastic','wood','bamboo','steel','stainless steel','iron','aluminum','aluminium','glass','ceramic'
];

const COUNTRIES = [
  'china','usa','united states','canada','mexico','germany','france','italy','spain','portugal','poland','uk','united kingdom',
  'japan','south korea','korea','india','vietnam','thailand','indonesia','turkey','brazil','australia','netherlands','sweden','denmark',
  'norway','finland','switzerland','austria','czech republic','romania','hungary'
];

const SIZES = ['xxs','xs','s','m','l','xl','xxl','xxxl'];

function uniq(arr, key) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = key ? key(item) : JSON.stringify(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

function titleCase(s) {
  return s.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function normalizeUnit(unit) {
  const m = unit.toLowerCase();
  if (m === 'lbs') return 'lb';
  if (m === 'kgs') return 'kg';
  if (m === 'cms') return 'cm';
  if (m === 'ins' || m === 'inches') return 'in';
  return m;
}

function parseNumber(n) {
  const x = parseFloat(n.replace(/,/g, '.'));
  return isNaN(x) ? null : x;
}

function suggestAttributes(text) {
  const input = (text || '').toString();
  const lower = input.toLowerCase();
  const suggestions = [];

  // Color by explicit color token or pattern "color: X"
  const colorPattern = /color\s*[:\-]\s*([a-zA-Z\s]+)/i;
  const colorMatch = input.match(colorPattern);
  if (colorMatch) {
    const raw = colorMatch[1].trim().split(/[,/]| and /i)[0].trim();
    if (raw) {
      suggestions.push({ group: 'Color', name: 'Color', value: titleCase(raw), confidence: 0.9, source: 'pattern' });
    }
  }
  for (const c of COLORS) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(input)) {
      suggestions.push({ group: 'Color', name: 'Color', value: titleCase(c), confidence: 0.7, source: 'keyword' });
    }
  }

  // Size tokens: S/M/L/XL, numeric sizes, and pattern "size: X"
  const sizePattern = /size\s*[:\-]\s*([a-z0-9\s+\/.-]+)/i;
  const sizeMatch = input.match(sizePattern);
  if (sizeMatch) {
    const raw = sizeMatch[1].trim().split(/[.,]/)[0].trim();
    if (raw) {
      suggestions.push({ group: 'Size', name: 'Size', value: raw.toUpperCase(), confidence: 0.9, source: 'pattern' });
    }
  }
  for (const s of SIZES) {
    if (new RegExp(`\\b${s}\\b`, 'i').test(lower)) {
      suggestions.push({ group: 'Size', name: 'Size', value: s.toUpperCase(), confidence: 0.7, source: 'keyword' });
    }
  }
  // Numeric sizes like 28, 30, 32 for waist or shoe sizes 6-13
  const numSizeMatches = lower.match(/\b([2-5][0-9]|[6-9]|1[0-3])\b(?=\s*(?:eu|us|uk|waist|shoe|size))?/g);
  if (numSizeMatches) {
    for (const n of numSizeMatches.slice(0, 3)) {
      suggestions.push({ group: 'Size', name: 'Size', value: n.toString(), confidence: 0.55, source: 'numeric' });
    }
  }

  // Material by pattern and keywords
  const materialPattern = /material\s*[:\-]\s*([^.,\n]+)/i;
  const materialMatch = input.match(materialPattern);
  if (materialMatch) {
    const raw = materialMatch[1].trim();
    suggestions.push({ group: 'Material', name: 'Material', value: titleCase(raw), confidence: 0.9, source: 'pattern' });
  }
  for (const m of MATERIALS) {
    if (new RegExp(`\\b${m}\\b`, 'i').test(lower)) {
      suggestions.push({ group: 'Material', name: 'Material', value: titleCase(m), confidence: 0.75, source: 'keyword' });
    }
  }

  // Country of Origin: pattern and keyword fallback
  const madeInPattern = /made in\s+([a-zA-Z\s]+)/i;
  const madeInMatch = input.match(madeInPattern);
  if (madeInMatch) {
    const raw = madeInMatch[1].trim().replace(/[.,].*$/, '');
    suggestions.push({ group: 'Country of Origin', name: 'Country of Origin', value: titleCase(raw), confidence: 0.95, source: 'pattern' });
  } else {
    for (const c of COUNTRIES) {
      if (new RegExp(`\\b${c}\\b`, 'i').test(lower)) {
        suggestions.push({ group: 'Country of Origin', name: 'Country of Origin', value: titleCase(c), confidence: 0.6, source: 'keyword' });
      }
    }
  }

  // Weight: e.g., 180 g, 0.5 kg, 2 lb, 12 oz
  const weightMatches = [...lower.matchAll(/(\d+[\.,]?\d*)\s*(kg|g|lb|lbs|oz)/g)];
  for (const m of weightMatches.slice(0, 2)) {
    const val = parseNumber(m[1]);
    const unit = normalizeUnit(m[2]);
    if (val !== null) {
      suggestions.push({ group: 'Weight', name: 'Weight', value: `${val} ${unit}`, confidence: 0.9, source: 'pattern' });
    }
  }

  // Dimensions: 30 x 20 x 2 cm, 12x8 in, 200x100mm
  const dimMatches = [...lower.matchAll(/(\d+[\.,]?\d*)\s*x\s*(\d+[\.,]?\d*)(?:\s*x\s*(\d+[\.,]?\d*))?\s*(mm|cm|in|inch|inches)?/g)];
  for (const d of dimMatches.slice(0, 2)) {
    const a = parseNumber(d[1]);
    const b = parseNumber(d[2]);
    const c = d[3] ? parseNumber(d[3]) : null;
    const rawUnit = d[4] || '';
    const unit = rawUnit ? normalizeUnit(rawUnit) : '';
    const value = c !== null ? `${a} x ${b} x ${c}${unit ? ' ' + unit : ''}` : `${a} x ${b}${unit ? ' ' + unit : ''}`;
    suggestions.push({ group: 'Dimensions', name: 'Dimensions', value, confidence: 0.85, source: 'pattern' });
  }

  // Brand: pattern "brand: X" or "by X"
  const brandPattern = /brand\s*[:\-]\s*([^.,\n]+)/i;
  const brandMatch = input.match(brandPattern);
  if (brandMatch) {
    const raw = brandMatch[1].trim();
    suggestions.push({ group: 'Brand', name: 'Brand', value: raw, confidence: 0.95, source: 'pattern' });
  } else {
    const byPattern = /\bby\s+([A-Z][A-Za-z0-9&\-\s]{1,40})\b/;
    const byMatch = input.match(byPattern);
    if (byMatch) {
      const raw = byMatch[1].trim().replace(/\s+$/,'');
      suggestions.push({ group: 'Brand', name: 'Brand', value: raw, confidence: 0.7, source: 'pattern' });
    }
  }

  // Gender
  if (/\bmen'?s\b|\bmale\b|\bfor men\b/i.test(input)) {
    suggestions.push({ group: 'Gender', name: 'Gender', value: 'Men', confidence: 0.7, source: 'keyword' });
  }
  if (/\bwomen'?s\b|\bfemale\b|\bfor women\b/i.test(input)) {
    suggestions.push({ group: 'Gender', name: 'Gender', value: 'Women', confidence: 0.7, source: 'keyword' });
  }
  if (/\bunisex\b/i.test(input)) {
    suggestions.push({ group: 'Gender', name: 'Gender', value: 'Unisex', confidence: 0.8, source: 'keyword' });
  }

  // Age Group
  if (/\bkids\b|\bchildren\b|\bchild\b|\byouth\b/i.test(input)) {
    suggestions.push({ group: 'Age Group', name: 'Age Group', value: 'Kids', confidence: 0.7, source: 'keyword' });
  }
  if (/\bbaby\b|\binfant\b|\btoddler\b/i.test(input)) {
    suggestions.push({ group: 'Age Group', name: 'Age Group', value: 'Baby', confidence: 0.7, source: 'keyword' });
  }
  if (/\badult\b/i.test(input)) {
    suggestions.push({ group: 'Age Group', name: 'Age Group', value: 'Adult', confidence: 0.6, source: 'keyword' });
  }

  // Clean up duplicates, keep highest confidence for same group/value
  const deduped = {};
  for (const s of suggestions) {
    const key = `${s.group}::${s.value.toLowerCase()}`;
    if (!deduped[key] || s.confidence > deduped[key].confidence) {
      deduped[key] = s;
    }
  }

  const finalList = Object.values(deduped)
    .sort((a, b) => {
      if (a.group === b.group) return b.confidence - a.confidence;
      return a.group.localeCompare(b.group);
    });

  return finalList;
}

module.exports = { suggestAttributes };
