'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const child = require('child_process');
const assert = require('assert');

const scriptPath = path.join(__dirname, '..', 'scripts', 'check-server-layout.js');

function runInTemp(setupFn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-check-'));
  try {
    if (setupFn) setupFn(tmp);
    const res = child.spawnSync(process.execPath, [scriptPath], { cwd: tmp, encoding: 'utf8' });
    return { tmp, res };
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
}

// Test: no duplicates => exit code 0
(function testNoDuplicates() {
  const { res } = runInTemp((tmp) => {
    // create only the canonical path
    fs.mkdirSync(path.join(tmp, 'src', 'server'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'src', 'server', 'index.js'), '// ok');
  });
  assert.strictEqual(res.status, 0, 'Expected exit code 0 when no duplicates exist');
  assert.ok(res.stdout && res.stdout.includes('Layout check passed'), 'Expected success message');
  console.log('✓ testNoDuplicates');
})();

// Test: duplicates => exit code 1 and helpful message
(function testDuplicates() {
  const { res } = runInTemp((tmp) => {
    fs.mkdirSync(path.join(tmp, 'server'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'src', 'server'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'server', 'a.js'), '// old');
    fs.writeFileSync(path.join(tmp, 'src', 'server', 'a.js'), '// new');
  });
  assert.strictEqual(res.status, 1, 'Expected exit code 1 when duplicates exist');
  const stderr = res.stderr || '';
  assert.ok(stderr.includes('Duplicate server/route directories detected') || stderr.includes('Duplicate'), 'Expected duplicate detection message');
  console.log('✓ testDuplicates');
})();

console.log('\nAll tests passed.');
