const { filterProducts } = require('../lib/products');

describe('filterProducts', () => {
  const dataset = [
    { name: 'Red Shoe', sku: 'RS-1', description: 'Comfortable everyday shoe' },
    { name: 'Blue Hat', sku: 'BH-2', description: 'Stylish and modern' },
    { name: 'Green Jacket', sku: 'GJ-3', description: 'Warm winter jacket' },
  ];

  test('returns all items when search is empty', () => {
    const result = filterProducts(dataset, '');
    expect(result).toHaveLength(dataset.length);
  });

  test('case-insensitive search matches name', () => {
    const result = filterProducts(dataset, 'red');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Red Shoe');
  });

  test('search can match description', () => {
    const result = filterProducts(dataset, 'winter');
    expect(result).toHaveLength(1);
    expect(result[0].sku).toBe('GJ-3');
  });

  test('non-matching search returns empty array', () => {
    const result = filterProducts(dataset, 'zzzznotfound');
    expect(result).toHaveLength(0);
  });
});
