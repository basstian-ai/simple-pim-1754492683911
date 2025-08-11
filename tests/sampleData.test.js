/*
  Minimal test without external dependencies. Run with:
  node tests/sampleData.test.js
*/
const assert = require("assert");
const { getSampleCatalog } = require("../lib/sampleData");

(function () {
  const { attributes, products } = getSampleCatalog();

  assert(Array.isArray(attributes), "attributes should be an array");
  assert(attributes.length > 0, "attributes should not be empty");
  attributes.forEach((group) => {
    assert(group.code && group.name, "attribute group must have code and name");
    assert(Array.isArray(group.attributes) && group.attributes.length > 0, "group.attributes must be non-empty");
    group.attributes.forEach((attr) => {
      assert(attr.code && attr.name, "attribute must have code and name");
    });
  });

  assert(Array.isArray(products), "products should be an array");
  assert(products.length > 0, "products should not be empty");

  const attrCodes = new Set(attributes.flatMap((g) => g.attributes.map((a) => a.code)));

  products.forEach((p) => {
    assert(p.id && p.slug && p.name, "product must have id, slug, name");
    assert(Array.isArray(p.variants) && p.variants.length > 0, "product must have at least one variant");
    p.variants.forEach((v) => {
      assert(v.id && v.sku, "variant must have id and sku");
      assert(typeof v.price === "number", "variant.price must be number");
      assert(v.options && typeof v.options === "object", "variant.options must be an object");
      Object.keys(v.options).forEach((k) => {
        assert(attrCodes.has(k), `variant option key ${k} must reference a defined attribute`);
      });
    });
  });

  console.log("OK: sampleData provides valid catalog with attribute groups and variants");
})();
