const assert = require('assert');
const { suggestAttributes } = require('../lib/attributeSuggest');

(function run() {
  const text = 'Red cotton t-shirt, size M, made in Portugal. Weight: 180 g. Dimensions: 30 x 20 x 2 cm. Brand: Acme. Unisex.';
  const res = suggestAttributes(text);

  function has(group, value) {
    return res.some((s) => s.group === group && new RegExp(value, 'i').test(s.value));
  }

  assert(has('Color', 'Red'), 'should detect Color: Red');
  assert(has('Material', 'Cotton'), 'should detect Material: Cotton');
  assert(has('Size', 'M'), 'should detect Size: M');
  assert(has('Country of Origin', 'Portugal'), 'should detect Country of Origin: Portugal');
  assert(has('Weight', '180'), 'should detect Weight 180 g');
  assert(has('Dimensions', '30 x 20 x 2'), 'should detect Dimensions');
  assert(has('Brand', 'Acme'), 'should detect Brand: Acme');
  assert(has('Gender', 'Unisex'), 'should detect Gender: Unisex');

  const text2 = 'Women\'s leather boots by BrandCo, size 38 EU, color: Black, made in Italy.';
  const res2 = suggestAttributes(text2);
  function has2(group, value) { return res2.some((s) => s.group === group && new RegExp(value, 'i').test(s.value)); }
  assert(has2('Gender', 'Women'), 'should detect Women gender');
  assert(has2('Material', 'Leather'), 'should detect Leather');
  assert(has2('Size', '38'), 'should detect numeric size');
  assert(has2('Color', 'Black'), 'should detect Black color');
  assert(has2('Country of Origin', 'Italy'), 'should detect Italy');

  console.log('attributeSuggest.test.js passed');
})();
