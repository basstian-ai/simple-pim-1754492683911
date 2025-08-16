const assert = require('assert')
const path = require('path')
const { lintFilePaths } = require('../tools/validate-api-routes')

// Unit tests for lintFilePaths (pure function tests)

;(function testValidKebabCaseFiles() {
  const files = [
    path.join('pages', 'api', 'fetch-product.ts'),
    path.join('pages', 'api', 'v2', 'list-items.js'),
    path.join('server', 'routes', 'index.ts') // parent name 'routes' is fine
  ]
  const violations = lintFilePaths(files)
  assert.strictEqual(Array.isArray(violations), true)
  assert.strictEqual(violations.length, 0, 'Expected no violations for valid kebab-case files')
})()

;(function testInvalidFilenames() {
  const files = [
    path.join('pages', 'api', 'FetchProduct.ts'),
    path.join('pages', 'api', 'list_items.js'),
    path.join('app', 'api', 'adminPanel.jsx')
  ]
  const violations = lintFilePaths(files)
  assert.strictEqual(violations.length, 3, 'Expected three violations for invalid filenames')
  // simple check that each returned entry includes the file path
  for (const v of violations) assert.ok(v.file && v.reason)
})()

;(function testIndexParentDirValidation() {
  const files = [
    path.join('pages', 'api', 'AdminPanel', 'index.ts'), // parent dir has uppercase
    path.join('src', 'app', 'api', 'cool-feature', 'index.ts') // parent 'cool-feature' ok
  ]
  const violations = lintFilePaths(files)
  assert.strictEqual(violations.length, 1, 'Expected one violation for bad parent directory name')
  assert.ok(violations[0].reason.includes('parent directory name'))
})()

console.log('validate-api-routes tests passed')
