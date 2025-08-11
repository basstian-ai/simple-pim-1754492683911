const buildProductsExportUrl = require('../lib/buildExportUrl');

describe('buildProductsExportUrl', () => {
  test('returns base export path when no filters provided', () => {
    expect(buildProductsExportUrl()).toBe('/api/products/export');
    expect(buildProductsExportUrl({})).toBe('/api/products/export');
  });

  test('includes search query when provided', () => {
    expect(buildProductsExportUrl({ search: 'blue shirt' })).toBe(
      '/api/products/export?search=blue%20shirt'
    );
  });

  test('includes tags when provided as array', () => {
    expect(buildProductsExportUrl({ tags: ['men', 'new'] })).toBe(
      '/api/products/export?tags=men,new'
    );
  });

  test('includes tags when provided as comma separated string', () => {
    expect(buildProductsExportUrl({ tags: 'men,new' })).toBe(
      '/api/products/export?tags=men,new'
    );
  });

  test('encodes tag values and search', () => {
    expect(buildProductsExportUrl({ search: 'red & blue', tags: ['women & kids', 'sale 10%'] })).toBe(
      '/api/products/export?search=red%20%26%20blue&tags=women%20%26%20kids,sale%2010%25'
    );
  });

  test('includes inStock when truthy', () => {
    expect(buildProductsExportUrl({ inStock: true })).toBe('/api/products/export?inStock=1');
    expect(buildProductsExportUrl({ inStock: '1' })).toBe('/api/products/export?inStock=1');
    expect(buildProductsExportUrl({ inStock: 1 })).toBe('/api/products/export?inStock=1');
  });

  test('combines multiple params in correct order', () => {
    expect(
      buildProductsExportUrl({ search: 'hat', tags: ['summer', 'sale'], inStock: true })
    ).toBe('/api/products/export?search=hat&tags=summer,sale&inStock=1');
  });
});
