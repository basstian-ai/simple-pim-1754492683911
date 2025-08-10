const isInStock = require('./isInStock');

function computeProductStats(products) {
  const list = Array.isArray(products) ? products : [];
  const totalProducts = list.length;
  let inStock = 0;
  const tagCounts = new Map();

  for (const p of list) {
    try {
      if (isInStock(p)) inStock += 1;
    } catch (_) {
      // if isInStock throws for any reason, treat as not in stock
    }
    const tags = Array.isArray(p.tags) ? p.tags : [];
    for (const t of tags) {
      if (t == null || t === '') continue;
      const key = String(t);
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    }
  }

  const tags = Array.from(tagCounts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .map(([tag, count]) => ({ tag, count }));

  return { totalProducts, inStock, tags };
}

module.exports = { computeProductStats };
