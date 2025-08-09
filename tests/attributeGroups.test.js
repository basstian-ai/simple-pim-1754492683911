const assert = require("assert");
const {
  normalizeAttributeKey,
  addGroup,
  addAttribute
} = require("../lib/attributeGroups");

// normalizeAttributeKey
assert.strictEqual(normalizeAttributeKey(" Color Name "), "color-name");
assert.strictEqual(normalizeAttributeKey("Size"), "size");
assert.strictEqual(normalizeAttributeKey("SEO Title!"), "seo-title");
assert.strictEqual(normalizeAttributeKey("  --  "), "");

// addGroup
let groups = [];
groups = addGroup(groups, "Basic");
assert.strictEqual(groups.length, 1);
assert.ok(groups[0].id && groups[0].name === "Basic");

// addAttribute (dedupe by key)
const gid = groups[0].id;
groups = addAttribute(groups, gid, "Color");
assert.strictEqual(groups[0].attributes.length, 1);
// Same key should not duplicate
groups = addAttribute(groups, gid, "color");
assert.strictEqual(groups[0].attributes.length, 1);

console.log("attributeGroups tests passed");
