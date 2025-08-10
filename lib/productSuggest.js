'use strict';

function normalize(s) {
  return (s || '').toString().toLowerCase();
}

function scoreProduct(q, p, tokens) {
  const name = normalize(p.name);
  const sku = normalize(p.sku);
  const desc = normalize(p.description);

  let score = 0;

  if (sku === q) score += 1000;
  if (name === q) score += 900;

  const skuPos = sku.indexOf(q);
  if (skuPos === 0) score += 800;
  else if (skuPos > -1) score += Math.max(0, 600 - skuPos);

  const namePos = name.indexOf(q);
  if (namePos === 0) score += 500;
  else if (namePos > -1) score += Math.max(0, 400 - namePos);

  const descPos = desc.indexOf(q);
  if (descPos > -1) score += Math.max(0, 100 - descPos);

  if (Array.isArray(tokens) && tokens.length) {
    for (const t of tokens) {
      const inSku = sku.indexOf(t) > -1;
      const inName = name.indexOf(t) > -1;
      const inDesc = desc.indexOf(t) > -1;
      if (inSku) score += 30;
      if (inName) score += 20;
      if (!inSku && !inName && inDesc) score += 5;
    }
  }

  return score;
}

function suggestProducts(query, products, limit = 10) {
  const q = normalize(query || '');
  if (!q.trim()) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const ranked = (products || [])
    .map((p) => ({ p, score: scoreProduct(q, p, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const an = (a.p.name || '').toString();
      const bn = (b.p.name || '').toString();
      return an.localeCompare(bn);
    })
    .slice(0, Math.max(1, Math.min(50, limit)));

  return ranked.map(({ p }) => ({ sku: p.sku, name: p.name }));
}

module.exports = {
  suggestProducts,
};
