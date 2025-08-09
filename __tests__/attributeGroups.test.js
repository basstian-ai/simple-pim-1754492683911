const { computeAttributeGroups } = require('../lib/attributeGroups');

describe('computeAttributeGroups', () => {
  test('groups attributes by explicit group or inferred from code', () => {
    const attrs = [
      { code: 'name', label: 'Name' },
      { code: 'price', label: 'Price' },
      { code: 'metaTitle', label: 'Meta Title', group: 'SEO' },
      { code: 'sku' }
    ];

    const groups = computeAttributeGroups(attrs);

    const byName = Object.fromEntries(groups.map((g) => [g.name, g]));

    expect(byName['Basic']).toBeDefined();
    expect(byName['Pricing']).toBeDefined();
    expect(byName['SEO']).toBeDefined();

    const basicCodes = new Set(byName['Basic'].attributes.map((a) => a.code));
    const pricingCodes = new Set(byName['Pricing'].attributes.map((a) => a.code));
    const seoCodes = new Set(byName['SEO'].attributes.map((a) => a.code));

    expect(basicCodes.has('name')).toBe(true);
    expect(basicCodes.has('sku')).toBe(true);
    expect(pricingCodes.has('price')).toBe(true);
    expect(seoCodes.has('metaTitle')).toBe(true);
  });
});
