const { generateSampleProducts } = require('../lib/sampleProductsGenerator');

describe('generateSampleProducts', () => {
  test('generates requested number of products with expected structure', () => {
    const products = generateSampleProducts(5);
    expect(Array.isArray(products)).toBe(true);
    expect(products).toHaveLength(5);

    const skus = new Set();
    products.forEach((p) => {
      expect(p).toHaveProperty('sku');
      expect(typeof p.sku).toBe('string');
      expect(p.sku.length).toBeGreaterThan(0);

      expect(p).toHaveProperty('name');
      expect(typeof p.name).toBe('string');

      expect(p).toHaveProperty('price');
      expect(typeof p.price).toBe('number');
      expect(p.price).toBeGreaterThan(0);

      expect(p).toHaveProperty('inStock');
      expect(typeof p.inStock).toBe('boolean');

      expect(p).toHaveProperty('images');
      expect(Array.isArray(p.images)).toBe(true);
      if (p.images.length > 0) {
        expect(typeof p.images[0]).toBe('string');
        expect(p.images[0]).toMatch(/^https?:\/\//);
      }

      expect(p).toHaveProperty('attributes');
      expect(typeof p.attributes).toBe('object');

      // skus should be unique
      expect(skus.has(p.sku)).toBe(false);
      skus.add(p.sku);

      // Validate variant structure when present
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          expect(v).toHaveProperty('sku');
          expect(v).toHaveProperty('price');
          expect(typeof v.price).toBe('number');
        });
      }
    });
  });

  test('defaults to 10 products when given invalid count', () => {
    const products = generateSampleProducts('invalid');
    expect(Array.isArray(products)).toBe(true);
    expect(products).toHaveLength(10);
  });
});
