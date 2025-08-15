const assert = require("assert");
const sampleProducts = require("../lib/sampleProducts");

describe("sampleProducts", () => {
  it("exports a non-empty array", () => {
    assert(Array.isArray(sampleProducts));
    assert(sampleProducts.length >= 3);
  });

  it("has required fields and variant/attribute structures", () => {
    for (const p of sampleProducts) {
      assert(p.id && typeof p.id === "string");
      assert(p.slug && typeof p.slug === "string");
      assert(p.name && typeof p.name === "string");
      assert(p.sku && typeof p.sku === "string");
      assert(Array.isArray(p.variants));
      assert(Array.isArray(p.attributeGroups));
      for (const g of p.attributeGroups) {
        assert(g.name && typeof g.name === "string");
        assert(Array.isArray(g.attributes));
      }
    }
  });
});
