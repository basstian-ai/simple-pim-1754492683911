#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const assert = require('assert');

function runScriptWithRoot(root) {
  const node = process.execPath;
  const script = path.join(__dirname, 'check-duplicates.js');
  const res = cp.spawnSync(node, [script], { env: { ...process.env, ROOT: root }, encoding: 'utf8' });
  return res;
}

function withTemp(fn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chkdup-'));
  try {
    return fn(tmp);
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
  }
}

// Case: clean layout -> expect success
let res = withTemp(root => {
  fs.mkdirSync(path.join(root, 'src', 'server'), { recursive: true });
  fs.mkdirSync(path.join(root, 'lib'), { recursive: true });
  return runScriptWithRoot(root);
});
assert.strictEqual(res.status, 0, 'Expected status 0 for a non-duplicate layout');

// Case: both server/ and src/server exist -> expect failure
res = withTemp(root => {
  fs.mkdirSync(path.join(root, 'server'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src', 'server'), { recursive: true });
  return runScriptWithRoot(root);
});
assert.notStrictEqual(res.status, 0, 'Expected non-zero exit for duplicate server directories');

// Case: overlapping route filenames -> expect failure
res = withTemp(root => {
  fs.mkdirSync(path.join(root, 'src', 'routes'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'routes', 'users.js'), '// users');
  fs.mkdirSync(path.join(root, 'src', 'server', 'routes'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'server', 'routes', 'users.js'), '// users duplicate');
  return runScriptWithRoot(root);
});
assert.notStrictEqual(res.status, 0, 'Expected non-zero exit for overlapping route files');

console.log('OK: check-duplicates self-tests passed');
process.exit(0);
