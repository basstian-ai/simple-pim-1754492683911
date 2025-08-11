import { addImagesToProducts } from '../lib/ensureProductImages';

describe('addImagesToProducts', () => {
  it('adds an image property using sku as seed when missing', () => {
    const input = [
      { sku: 'SKU-123', name: 'Test product' },
      { sku: 'another/sku', name: 'Another' },
    ];
    const out = addImagesToProducts(input);
    expect(out).toHaveLength(2);
    expect(out[0].image).toBeDefined();
    expect(typeof out[0].image).toBe('string');
    expect(out[0].image).toContain('/200/200');
    // seed should be encoded for URL safety
    expect(encodeURIComponent('another/sku')).toBeTruthy();
    expect(out[1].image).toContain(encodeURIComponent('another/sku'));
  });

  it('uses slugified name when sku is not available', () => {
    const input = [{ name: 'Fancy Product  ♪' }];
    const out = addImagesToProducts(input);
    expect(out[0].image).toContain('/200/200');
    // should include a slugified fragment (fancy-product)
    expect(out[0].image.toLowerCase()).toContain('fancy-product');
  });

  it('preserves an existing image property', () => {
    const input = [{ sku: 'a', image: 'https://example.com/x.png' }];
    const out = addImagesToProducts(input);
    expect(out[0].image).toBe('https://example.com/x.png');
  });

  it('handles non-arrays gracefully', () => {
    expect(addImagesToProducts(null)).toEqual([]);
    expect(addImagesToProducts(undefined)).toEqual([]);
  });
});
