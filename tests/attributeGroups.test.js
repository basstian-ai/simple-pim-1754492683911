const assert = require('assert');
const { validateGroup, addGroup, isCodeUnique } = require('../lib/attributeGroups');

(function testValidate() {
  let { valid, errors } = validateGroup({ code: '', name: '' });
  assert.strictEqual(valid, false);
  assert.ok(errors.code);
  assert.ok(errors.name);

  ({ valid, errors } = validateGroup({ code: 'SEO', name: 'Search' }));
  assert.strictEqual(valid, true);
  assert.strictEqual(errors && Object.keys(errors).length, 0);
})();

(function testAddAndUnique() {
  const groups = [{ code: 'basic', name: 'Basic' }];
  assert.strictEqual(isCodeUnique(groups, 'seo'), true);
  assert.strictEqual(isCodeUnique(groups, 'basic'), false);

  const { ok, groups: updated } = addGroup(groups, { code: 'seo', name: 'SEO' });
  assert.strictEqual(ok, true);
  assert.strictEqual(updated.length, 2);
})();

console.log('attributeGroups tests passed');
