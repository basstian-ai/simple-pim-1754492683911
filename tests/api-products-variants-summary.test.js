const handler = require('../pages/api/products/variants-summary').default;
const products = require('../data/products.json');

function createMockRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json };
}

test('GET /api/products/variants-summary returns aggregated variant data', async () => {
  const req = { method: 'GET' };
  const res = createMockRes();

  await handler(req, res);

  // Build expected values from the source data
  const expectedTotalProducts = products.length;
  const expectedTotalVariants = products.reduce((acc, p) => acc + (Array.isArray(p.variants) ? p.variants.length : 0), 0);
  const expectedProductsWithVariants = products.filter((p) => Array.isArray(p.variants) && p.variants.length > 0).length;

  const expectedVariantsByProduct = {};
  const expectedAttributeValueCounts = {};

  products.forEach((p) => {
    const sku = p.sku || p.id || p.name || 'unknown';
    const variants = Array.isArray(p.variants) ? p.variants : [];
    expectedVariantsByProduct[sku] = variants.length;

    variants.forEach((v) => {
      const attrs = v.attributes || {};
      Object.keys(attrs).forEach((attrKey) => {
        const val = attrs[attrKey];
        if (val == null) return;
        expectedAttributeValueCounts[attrKey] = expectedAttributeValueCounts[attrKey] || {};
        expectedAttributeValueCounts[attrKey][String(val)] = (expectedAttributeValueCounts[attrKey][String(val)] || 0) + 1;
      });
    });
  });

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.status.mock.calls.length).toBeGreaterThanOrEqual(1);
  // The json function is returned from status(), so inspect the last call's json
  const jsonMock = res.status.mock.results[0].value.json || res.json;
  // Because our status mock returns an object with json, the json function will be the one captured earlier
  // Instead of trying to reach into mock internals, just check that res.status was called and that res.status().json was called via the mock implementation.

  // Validate the payload by calling the handler and ensuring the json mock was invoked with expected payload.
  // The json function was created in createMockRes and is available as res.status().json when status() is called.
  // Because status was mocked to return { json }, we can access it via res.status.mock.results[0].value.json
  const calledJson = res.status.mock.results[0].value.json;
  expect(calledJson).toHaveBeenCalled();

  const payload = calledJson.mock.calls[0][0];

  expect(payload).toMatchObject({
    totalProducts: expectedTotalProducts,
    totalVariants: expectedTotalVariants,
    productsWithVariants: expectedProductsWithVariants,
    variantsByProduct: expectedVariantsByProduct,
    attributeValueCounts: expectedAttributeValueCounts,
  });
});
