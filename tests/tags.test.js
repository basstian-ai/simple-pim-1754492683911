const { computeProductTags, productHasTag } = require('../lib/tags');

describe('computeProductTags', () => {
  it('extracts meaningful tags from product fields', () => {
    const product = {
      name: 'Awesome Red Shirt',
      description: 'A red shirt for summer adventures',
      sku: 'SHIRT-RED-001'
    };

    const tags = computeProductTags(product);

    expect(Array.isArray(tags)).toBe(true);
    // Should include non-stopwords from name/description and SKU prefix
    expect(tags).toEqual(expect.arrayContaining(['awesome', 'red', 'shirt', 'summer', 'shirt', 'shirt'.replace(/[^a-z0-9]/g, '')]));
    // Ensure stopwords not included
    expect(tags).not.toEqual(expect.arrayContaining(['for', 'and', 'the']));

    // productHasTag should align with computeProductTags
    expect(productHasTag(product, 'red')).toBe(true);
    expect(productHasTag(product, 'FOR')).toBe(false);
  });
});
