'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { findDuplicates } = require('../scripts/check-duplicate-server-paths');

function tmpdir(prefix = 'dup-check-') {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return base;
}

function safeRmDir(dir) {
  if (!fs.existsSync(dir)) return;
  // recursive remove for test sandbox
  fs.rmSync(dir, { recursive: true, force: true });
}

function createDirs(root, rels) {
  for (const r of rels) {
    const p = path.join(root, r);
    fs.mkdirSync(p, { recursive: true });
  }
}

function runTests() {
  // Test 1: no duplicates present
  const t1 = tmpdir();
  try {
    createDirs(t1, ['src/server']);
    const res = findDuplicates(t1);
    assert(Array.isArray(res), 'result should be array');
    assert.strictEqual(res.length, 0, 'expected no duplicates when only src/server exists');
  } finally {
    safeRmDir(t1);
  }

  // Test 2: server and src/server -> duplicate
  const t2 = tmpdir();
  try {
    createDirs(t2, ['server', 'src/server']);
    const res = findDuplicates(t2);
    assert.strictEqual(res.length, 1, 'expected one duplicate pair for server vs src/server');
    assert.strictEqual(res[0].a, 'server');
    assert.strictEqual(res[0].b, 'src/server');
  } finally {
    safeRmDir(t2);
  }

  // Test 3: src/routes and src/server/routes -> duplicate
  const t3 = tmpdir();
  try {
    createDirs(t3, ['src/routes', 'src/server/routes']);
    const res = findDuplicates(t3);
    assert.strictEqual(res.length, 1, 'expected one duplicate pair for routes vs src/server/routes');
    assert.strictEqual(res[0].a, 'src/routes');
    assert.strictEqual(res[0].b, 'src/server/routes');
  } finally {
    safeRmDir(t3);
  }

  // Test 4: multiple duplicates
  const t4 = tmpdir();
  try {
    createDirs(t4, ['server', 'src/server', 'src/routes', 'src/server/routes']);
    const res = findDuplicates(t4);
    // we expect two pairs
    assert.strictEqual(res.length, 2, 'expected two duplicate pairs');
  } finally {
    safeRmDir(t4);
  }

  console.log('All check-duplicate-server-paths tests passed.');
}

if (require.main === module) {
  try {
    runTests();
    process.exit(0);
  } catch (err) {
    console.error('Test failure:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
