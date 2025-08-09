/*
  Simple test for lib/attributeGroups using a minimal in-memory localStorage polyfill.
  This file is intentionally framework-agnostic; if Jest is present, you can run it.
*/

const assert = require('assert');

class MemoryStorage {
  constructor() { this._s = {}; }
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._s, k) ? this._s[k] : null; }
  setItem(k, v) { this._s[k] = String(v); }
  removeItem(k) { delete this._s[k]; }
  clear() { this._s = {}; }
}

global.localStorage = new MemoryStorage();

const ag = require('../lib/attributeGroups');

(function testSaveLoad() {
  const groups = ag.loadAttributeGroups();
  assert(Array.isArray(groups) && groups.length === 0, 'Should start empty');

  const { list, group } = ag.upsertGroup([], { name: 'Basic', description: 'Common fields' });
  assert(group.id, 'Group should have id');
  assert(list.length === 1, 'List should have one group');
  ag.saveAttributeGroups(list);

  const loaded = ag.loadAttributeGroups();
  assert(loaded.length === 1 && loaded[0].name === 'Basic', 'Should persist and load same group');

  const g2 = ag.upsertAttribute(loaded[0], { code: 'brand', label: 'Brand', type: 'text' });
  assert(g2.attributes.length === 1 && g2.attributes[0].code === 'brand', 'Attribute should be added');

  console.log('attributeGroups: OK');
})();
