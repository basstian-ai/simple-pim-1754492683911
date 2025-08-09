const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'are', 'was', 'were', 'will', 'you', 'your', 'our', 'their', 'its',
  'a', 'an', 'to', 'of', 'in', 'on', 'by', 'at', 'as', 'is', 'it', 'or', 'be'
]);

function normalizeWord(w) {
  if (!w) return '';
  const t = String(w).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (t.length < 3) return '';
  if (STOPWORDS.has(t)) return '';
  return t;
}

export function computeProductTags(product) {
  const tags = new Set();
  if (!product || typeof product !== 'object') return [];

  const { name, description, sku } = product;

  const addWords = (text) => {
    if (!text) return;
    String(text)
      .split(/\s+/)
      .map(normalizeWord)
      .filter(Boolean)
      .forEach((w) => tags.add(w));
  };

  addWords(name);
  addWords(description);

  if (sku) {
    const prefix = String(sku).split(/[-_\s]/)[0];
    if (prefix && prefix.length >= 2) tags.add(prefix.toLowerCase());
  }

  return Array.from(tags);
}

export function productHasTag(product, tag) {
  if (!tag) return true;
  const t = String(tag).toLowerCase();
  return computeProductTags(product).includes(t);
}

export function aggregateTags(products) {
  const map = new Map();
  (products || []).forEach((p) => {
    computeProductTags(p).forEach((t) => {
      map.set(t, (map.get(t) || 0) + 1);
    });
  });
  return map;
}

export function getAllTags({ search } = {}) {
  // Lazy-load data to avoid bundling on client
  const products = require('../data/products.json');
  const map = aggregateTags(products);
  let tags = Array.from(map.keys());
  if (search) {
    const s = String(search).toLowerCase();
    tags = tags.filter((t) => t.includes(s));
  }
  tags.sort();
  return tags;
}
