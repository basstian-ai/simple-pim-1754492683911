const assert = require('assert');
const { getSampleProducts } = require('../lib/data/sampleProducts');

function run() {
  const products = getSampleProducts();
  assert(Array.isArray(products), 'products should be an array');
  assert(products.length >= 3, 'should have at least 3 sample products');

  for (const p of products) {
    assert(p.id && typeof p.id === 'string', 'product.id should be string');
    assert(p.sku && typeof p.sku === 'string', 'product.sku should be string');
    assert(p.name && typeof p.name === 'string', 'product.name should be string');
    assert(typeof p.price === 'number', 'product.price should be number');
    assert(p.currency && typeof p.currency === 'string', 'product.currency should be string');
    assert(p.attributes && Array.isArray(p.attributes), 'product.attributes should be array');
  }

  // Check attribute groups include General at least for first product
  const hasGeneral = products[0].attributes.some((g) => g.group === 'General');
  assert(hasGeneral, 'first product should have General attribute group');

  // Variants shape check (if any)
  const prodWithVariants = products.find((p) => Array.isArray(p.variants) && p.variants.length > 0);
  if (prodWithVariants) {
    const v = prodWithVariants.variants[0];
    assert(v.id && v.sku, 'variant should have id and sku');
    assert(v.options && typeof v.options === 'object', 'variant.options should be object');
  }

  console.log('OK: sampleProducts shape is valid.');
}

if (require.main === module) {
  try {
    run();
  } catch (err) {
    console.error('Test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

module.exports = { run };
