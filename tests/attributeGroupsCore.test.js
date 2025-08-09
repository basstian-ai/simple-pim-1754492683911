const assert = require("assert");
const core = require("../lib/attributeGroupsCore");

(function run() {
  let state = [];

  // Create group
  state = core.createGroup(state, { name: "Specifications" });
  assert.strictEqual(state.length, 1, "should have one group");
  const gid = state[0].id;
  assert.ok(gid.startsWith("ag_"), "group id generated");

  // Add attribute
  state = core.addAttribute(state, gid, { code: "weight", label: "Weight", type: "number" });
  assert.strictEqual(state[0].attributes.length, 1, "added one attribute");

  // Unique code enforcement
  let dupErr = null;
  try {
    state = core.addAttribute(state, gid, { code: "weight", label: "Weight again", type: "number" });
  } catch (e) {
    dupErr = e;
  }
  assert.ok(dupErr instanceof Error, "duplicate attribute code should throw");

  // Update attribute
  state = core.updateAttribute(state, gid, "weight", { label: "Net Weight", type: "number" });
  assert.strictEqual(state[0].attributes[0].label, "Net Weight", "label updated");

  // Delete attribute
  state = core.deleteAttribute(state, gid, "weight");
  assert.strictEqual(state[0].attributes.length, 0, "attribute deleted");

  // Rename group
  state = core.updateGroup(state, gid, { name: "Specs" });
  assert.strictEqual(state[0].name, "Specs", "group renamed");

  // Delete group
  state = core.deleteGroup(state, gid);
  assert.strictEqual(state.length, 0, "group deleted");

  console.log("attributeGroupsCore tests passed");
})();
