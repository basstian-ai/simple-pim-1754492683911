'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const { findDuplicateServerPaths } = require('../scripts/lib/checkPaths');

function makeDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function removeDir(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function runTests() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dup-path-test-'));
  try {
    // Case 1: both server and src/server exist -> should detect issue
    const serverA = path.join(tmpRoot, 'server');
    const serverB = path.join(tmpRoot, 'src', 'server');
    makeDir(serverA);
    makeDir(serverB);

    let issues = findDuplicateServerPaths(tmpRoot);
    assert.ok(Array.isArray(issues), 'issues should be array');
    assert.ok(issues.length >= 1, 'expected at least one duplicate issue when both server and src/server exist');

    // Clean up and Case 2: only canonical path exists -> no issues
    removeDir(tmpRoot);
    makeDir(path.join(tmpRoot, 'src', 'server'));

    issues = findDuplicateServerPaths(tmpRoot);
    assert.strictEqual(issues.length, 0, 'expected no issues when only canonical path exists');

    console.log('OK: all tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err && (err.stack || err));
    process.exit(2);
  } finally {
    try { removeDir(tmpRoot); } catch (_) {}
  }
}

if (require.main === module) runTests();
