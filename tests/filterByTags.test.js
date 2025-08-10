const { filterByTags } = require('../lib/filterProducts');

describe('filterByTags', () => {
  const products = [
    { id: '1', name: 'Red Shirt', tags: ['apparel', 'red'] },
    { id: '2', name: 'Blue Shirt', tags: ['apparel', 'blue'] },
    { id: '3', name: 'Green Mug', tags: ['kitchen', 'green'] },
    { id: '4', name: 'Untagged' },
  ];

  it('returns all products when tags are empty/undefined', () => {
    expect(filterByTags(products)).toHaveLength(4);
    expect(filterByTags(products, [])).toHaveLength(4);
  });

  it('filters by a single tag', () => {
    const out = filterByTags(products, ['apparel']);
    expect(out.map((p) => p.name).sort()).toEqual(['Blue Shirt', 'Red Shirt']);
  });

  it('requires products to include all selected tags', () => {
    const out = filterByTags(products, ['apparel', 'red']);
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe('Red Shirt');
  });

  it('returns empty when no product has the tag', () => {
    const out = filterByTags(products, ['__nonexistent__']);
    expect(out).toHaveLength(0);
  });
});
