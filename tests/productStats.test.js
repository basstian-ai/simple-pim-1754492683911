const { computeProductStats } = require('../lib/productStats');
const products = require('../data/products.json');

function countTotalTagAssignments(list) {
  return (Array.isArray(list) ? list : []).reduce(
    (sum, p) => sum + (Array.isArray(p.tags) ? p.tags.length : 0),
    0
  );
}

describe('computeProductStats', () => {
  test('returns correct shape and counts', () => {
    const stats = computeProductStats(products);

    expect(stats).toBeTruthy();
    expect(typeof stats.totalProducts).toBe('number');
    expect(typeof stats.inStock).toBe('number');
    expect(Array.isArray(stats.tags)).toBe(true);

    expect(stats.totalProducts).toBe(Array.isArray(products) ? products.length : 0);
    expect(stats.inStock).toBeGreaterThanOrEqual(0);
    expect(stats.inStock).toBeLessThanOrEqual(stats.totalProducts);

    // Sum of tag counts equals total tag assignments across products
    const totalTagAssignments = countTotalTagAssignments(products);
    const sumFromStats = stats.tags.reduce((s, t) => s + (t.count || 0), 0);
    expect(sumFromStats).toBe(totalTagAssignments);

    // tags are sorted by count desc then tag asc
    for (let i = 1; i < stats.tags.length; i++) {
      const prev = stats.tags[i - 1];
      const cur = stats.tags[i];
      expect(prev.count).toBeGreaterThanOrEqual(cur.count);
      if (prev.count === cur.count) {
        expect(prev.tag.localeCompare(cur.tag) <= 0).toBe(true);
      }
    }
  });
});
