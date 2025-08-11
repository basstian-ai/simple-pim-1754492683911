import generateSampleProducts from '../lib/sampleProductsGenerator';

describe('generateSampleProducts', () => {
  test('generates requested number of products', () => {
    const list = generateSampleProducts(20);
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(20);
  });

  test('each product has attributes object with color and size', () => {
    const list = generateSampleProducts(12);
    for (const p of list) {
      expect(p).toHaveProperty('attributes');
      expect(typeof p.attributes).toBe('object');
      expect(p.attributes).toHaveProperty('color');
      expect(p.attributes).toHaveProperty('size');
    }
  });

  test('some products contain variants with their own skus and attributes', () => {
    const list = generateSampleProducts(40);
    const withVariants = list.filter((p) => Array.isArray(p.variants) && p.variants.length > 0);
    expect(withVariants.length).toBeGreaterThan(0);

    // Check variant shape
    const variant = withVariants[0].variants[0];
    expect(variant).toHaveProperty('sku');
    expect(variant).toHaveProperty('attributes');
    expect(variant.attributes).toHaveProperty('color');
  });
});
