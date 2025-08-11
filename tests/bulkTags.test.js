const { applyBulkTags } = require('../lib/bulkTags');

describe('applyBulkTags', () => {
  test('adds and removes tags without mutating input', () => {
    const products = [
      { sku: 'A', tags: ['alpha', 'beta'] },
      { sku: 'B', tags: [] },
    ];

    const res = applyBulkTags(products, { skus: ['A', 'B'], add: ['new'], remove: ['beta'] });

    // Input not mutated
    expect(products[0].tags).toEqual(['alpha', 'beta']);

    // Stats
    expect(res.stats.matched).toBe(2);
    expect(res.stats.updated).toBe(2);
    expect(res.stats.added).toBe(2 - 0); // 'new' added to both
    expect(res.stats.removed).toBe(1); // 'beta' removed from A only

    // Items
    const a = res.items.find((i) => i.sku === 'A');
    const b = res.items.find((i) => i.sku === 'B');

    expect(a.before).toEqual(['alpha', 'beta']);
    expect(a.after).toEqual(expect.arrayContaining(['alpha', 'new']));
    expect(a.after).not.toEqual(expect.arrayContaining(['beta']));

    expect(b.before).toEqual([]);
    expect(b.after).toEqual(['new']);
  });

  test('handles empty ops gracefully', () => {
    const products = [ { sku: 'X', tags: ['t'] } ];
    const res = applyBulkTags(products, { skus: ['X'] });
    expect(res.stats.matched).toBe(1);
    expect(res.stats.updated).toBe(0);
    expect(res.items[0].after).toEqual(['t']);
  });
});
