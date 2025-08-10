const assert = require('assert');
const { suggestAttributesFromText } = require('../lib/attributeSuggestor');

function run() {
  const text = 'Acme Cotton T-Shirt, size M, color Black. Made of 100% cotton. Brand: Acme. Dimensions: 10 x 20 x 5 cm. SKU: SHIRT-001';
  const attrs = suggestAttributesFromText(text);

  const byCode = (code) => attrs.filter(a => a.code === code);
  const has = (code, val) => byCode(code).some(a => String(a.value).toLowerCase() === String(val).toLowerCase());

  assert.ok(attrs.length >= 4, 'should extract several attributes');
  assert.ok(has('color', 'black'), 'should detect color black');
  assert.ok(has('material', 'cotton'), 'should detect material cotton');
  assert.ok(has('size', 'M'), 'should detect size M');
  assert.ok(has('brand', 'Acme'), 'should detect brand Acme');
  assert.ok(has('sku', 'SHIRT-001'), 'should detect SKU');
}

if (typeof describe === 'function') {
  describe('attributeSuggestor', () => {
    it('extracts common attributes from text', () => {
      run();
    });
  });
} else {
  // Fallback runner if executed directly via node
  run();
  console.log('attributeSuggestor tests passed');
}
