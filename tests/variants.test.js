const { cartesian, generateVariants } = require('../lib/variants');

describe('variants generation', () => {
  test('cartesian with empty axes yields one empty combination', () => {
    const combos = cartesian([]);
    expect(Array.isArray(combos)).toBe(true);
    expect(combos.length).toBe(1);
    expect(combos[0]).toEqual([]);
  });

  test('generateVariants from two axes', () => {
    const axes = [
      { code: 'color', label: 'Color', options: ['Red', 'Blue'] },
      { code: 'size', label: 'Size', options: ['S', 'M', 'L'] },
    ];
    const { count, variants } = generateVariants(axes, { baseSku: 'TSHIRT', baseName: 'T-Shirt' });
    expect(count).toBe(6);
    expect(variants.length).toBe(6);

    const sample = variants[0];
    expect(sample).toHaveProperty('sku');
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('options');

    // SKU contains base and option slugs
    expect(sample.sku.startsWith('TSHIRT')).toBe(true);

    // Options map has codes
    expect(Object.keys(sample.options)).toEqual(expect.arrayContaining(['color', 'size']));
  });
});
