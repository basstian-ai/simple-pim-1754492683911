"use strict";

const assert = require("assert");
const store = require("../lib/attributeGroupsStore");

(function run() {
  // reset to known state
  store.__reset();

  const startCount = store.listGroups().length;
  assert.ok(startCount >= 1, "should have at least one default group");

  // create
  const created = store.createGroup({
    name: "Sizes",
    attributes: [
      { code: "size", label: "Size", type: "text" },
      { code: "waist", label: "Waist", type: "number" },
    ],
  });

  assert.ok(created && created.id, "created group should have id");
  assert.strictEqual(created.name, "Sizes");
  assert.ok(Array.isArray(created.attributes) && created.attributes.length === 2);

  // update
  const updated = store.updateGroup(created.id, { name: "Size & Fit" });
  assert.strictEqual(updated.name, "Size & Fit");
  assert.ok(updated.updatedAt !== updated.createdAt);

  // get
  const fetched = store.getGroup(created.id);
  assert.ok(fetched && fetched.id === created.id);

  // delete
  const deleted = store.deleteGroup(created.id);
  assert.strictEqual(deleted, true);

  const deletedAgain = store.deleteGroup(created.id);
  assert.strictEqual(deletedAgain, false);

  console.log("attribute-groups tests: OK");
})();
