// Simple node test for scripts/check-duplicate-servers.js
// This test creates a temporary directory with duplicate server paths and
// asserts that the check script exits non-zero and prints a helpful message.

const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');

const script = path.join(__dirname, '..', 'scripts', 'check-duplicate-servers.js');

function mkdirp(p) {
  try {
    fs.mkdirSync(p, { recursive: true });
  } catch (e) {}
}

function runTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dup-test-'));
  try {
    // create both server and src/server to trigger detection
    mkdirp(path.join(tmp, 'server'));
    mkdirp(path.join(tmp, 'src', 'server'));

    const res = child.spawnSync(process.execPath, [script], { cwd: tmp, encoding: 'utf8' });

    if (res.status === 0) {
      console.error('TEST FAIL: expected non-zero exit code when duplicates exist');
      process.exit(3);
    }

    const out = (res.stdout || '') + (res.stderr || '');
    if (!/duplicate server\/route directories detected/i.test(out)) {
      console.error('TEST FAIL: expected diagnostic about duplicate server/route directories');
      console.error('Captured output:\n', out);
      process.exit(4);
    }

    console.log('TEST PASS: duplicate detection triggered as expected');
    process.exit(0);
  } finally {
    // best-effort cleanup
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }
}

if (require.main === module) runTest();
