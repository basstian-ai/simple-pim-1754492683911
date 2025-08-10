const { suggestProducts } = require('../lib/productSuggest');

test('suggestProducts returns empty for empty query', () => {
  const products = [
    { sku: 'ABC-123', name: 'Red Shirt', description: 'Cotton shirt' },
  ];
  expect(suggestProducts('', products)).toEqual([]);
});

test('suggestProducts favors exact SKU and name matches', () => {
  const products = [
    { sku: 'ABC-123', name: 'Red Shirt', description: 'Cotton shirt' },
    { sku: 'PHONE-XL', name: 'Smartphone XL', description: 'Latest smartphone' },
    { sku: 'ABC-999', name: 'Blue Shirt', description: 'Blue cotton shirt' },
  ];

  const bySku = suggestProducts('abc-123', products);
  expect(bySku[0]).toEqual({ sku: 'ABC-123', name: 'Red Shirt' });

  const byName = suggestProducts('smartphone xl', products);
  expect(byName[0]).toEqual({ sku: 'PHONE-XL', name: 'Smartphone XL' });
});

test('suggestProducts token scoring boosts multi-word queries', () => {
  const products = [
    { sku: 'TSHIRT-RED-M', name: 'T-Shirt Red Medium', description: 'Soft cotton tee' },
    { sku: 'TSHIRT-BLUE-M', name: 'T-Shirt Blue Medium', description: 'Soft cotton tee' },
  ];

  const res = suggestProducts('red shirt', products);
  expect(res[0].sku).toBe('TSHIRT-RED-M');
});
