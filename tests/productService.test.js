'use strict';

const assert = require('assert');
const { InMemoryStore } = require('../src/inMemoryStore');
const { ProductService } = require('../src/productService');
const { UniqueConstraintError } = require('../src/errors');

async function testUniqueViolationThrows() {
  const store = new InMemoryStore({ checkDelay: 5, writeDelay: 5 });
  const svc = new ProductService(store);

  const a = await svc.createProduct({ sku: 'SKU1', slug: 'my-product', title: 'A' });
  assert.ok(a.id, 'created');

  let threw = false;
  try {
    await svc.createProduct({ sku: 'SKU1', slug: 'my-product-2', title: 'B' }, { autoSuffix: false });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof UniqueConstraintError, 'should be UniqueConstraintError');
    assert.deepStrictEqual(err.fields, ['sku']);
  }
  assert.ok(threw, 'expected error on duplicate sku');
}

async function testAutoSuffixSlug() {
  const store = new InMemoryStore({ checkDelay: 5, writeDelay: 5 });
  const svc = new ProductService(store);

  await svc.createProduct({ sku: 'X1', slug: 'my-product', title: 'base' });
  const b = await svc.createProduct({ sku: 'X2', slug: 'my-product', title: 'child' }, { autoSuffix: true });
  assert.strictEqual(b.slug, 'my-product-1');
}

async function testConcurrentCreates() {
  const store = new InMemoryStore({ checkDelay: 30, writeDelay: 30 });
  const svc = new ProductService(store);

  const concurrency = 5;
  const base = { sku: 'CSKU', slug: 'concurrent', title: 'con' };

  // start many concurrent creates with autoSuffix enabled for both sku and slug
  const promises = Array.from({ length: concurrency }).map((_, i) =>
    svc.createProduct(Object.assign({}, base, { title: `p${i}` }), { autoSuffix: true, autoSuffixSku: true, maxAttempts: 20 })
  );

  const results = await Promise.all(promises);
  const slugs = results.map((r) => r.slug);
  const skus = results.map((r) => r.sku);

  // all slugs/skus must be unique
  assert.strictEqual(new Set(slugs).size, concurrency, 'slugs unique');
  assert.strictEqual(new Set(skus).size, concurrency, 'skus unique');

  // ensure base is present and suffixes start at -1...
  assert.ok(slugs.includes('concurrent') || slugs.includes('concurrent-1'));
}

async function testConcurrentUpdates() {
  const store = new InMemoryStore({ checkDelay: 20, writeDelay: 20 });
  const svc = new ProductService(store);

  // create three initial products
  const p1 = await svc.createProduct({ sku: 'U1', slug: 'u1', title: 't1' });
  const p2 = await svc.createProduct({ sku: 'U2', slug: 'u2', title: 't2' });
  const p3 = await svc.createProduct({ sku: 'U3', slug: 'u3', title: 't3' });

  // Try to update all to the same slug concurrently, allowing autoSuffix
  const targetSlug = 'merged-slug';
  const promises = [p1, p2, p3].map((p) =>
    svc.updateProduct(p.id, { slug: targetSlug }, { autoSuffix: true, maxAttempts: 10 })
  );

  const updated = await Promise.all(promises);
  const slugs = updated.map((u) => u.slug);
  assert.strictEqual(new Set(slugs).size, 3, 'updated slugs unique');
}

async function runAll() {
  const tests = [
    testUniqueViolationThrows,
    testAutoSuffixSlug,
    testConcurrentCreates,
    testConcurrentUpdates,
  ];

  console.log(`Running ${tests.length} tests...`);

  for (const t of tests) {
    try {
      await t();
      console.log(`✓ ${t.name}`);
    } catch (err) {
      console.error(`✗ ${t.name}`);
      console.error(err && err.stack ? err.stack : err);
      process.exitCode = 1;
      return;
    }
  }

  console.log('All tests passed');
}

if (require.main === module) {
  runAll().catch((err) => {
    console.error('Uncaught error in tests:', err);
    process.exitCode = 1;
  });
}
