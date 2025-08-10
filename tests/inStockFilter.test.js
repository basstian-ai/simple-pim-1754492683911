const filterProducts = require('../lib/filterProducts');

describe('filterProducts inStock option', () => {
  const products = [
    { sku: 'A', name: 'Alpha', inStock: true },
    { sku: 'B', name: 'Beta', inStock: false },
    { sku: 'C', name: 'Gamma', quantity: 3 },
    { sku: 'D', name: 'Delta', stock: 0 },
  ];

  test('when inStock not set, returns all', () => {
    const result = filterProducts(products, {});
    expect(result.map((p) => p.sku)).toEqual(['A', 'B', 'C', 'D']);
  });

  test('when inStock true, filters correctly', () => {
    const result = filterProducts(products, { inStock: true });
    expect(result.map((p) => p.sku)).toEqual(['A', 'C']);
  });
});
