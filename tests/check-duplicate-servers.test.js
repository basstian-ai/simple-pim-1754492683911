'use strict';

// Minimal test harness that verifies the check script behaviour using temp dirs.
// This test does not modify the repository; it creates temporary folders to simulate layouts.

const fs = require('fs');
const os = require('os');
const path = require('path');
const child = require('child_process');

function spawnCheck(root) {
  const script = path.resolve(__dirname, '..', 'scripts', 'check-duplicate-servers.js');
  const res = child.spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  return res;
}

function mkdtemp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dup-server-test-'));
}

function touchDir(base, rel) {
  const p = path.join(base, rel);
  fs.mkdirSync(p, { recursive: true });
}

function run() {
  // Case A: Only canonical path present -> success (exit 0)
  const a = mkdtemp();
  touchDir(a, 'src/server');
  const resA = spawnCheck(a);
  if (resA.status !== 0) {
    console.error('Case A failed; expected success but got:', resA.status, resA.stdout, resA.stderr);
    process.exit(1);
  }
  console.log('Case A OK');

  // Case B: Duplicate server dirs -> fail (non-zero)
  const b = mkdtemp();
  touchDir(b, 'server');
  touchDir(b, 'src/server');
  const resB = spawnCheck(b);
  if (resB.status === 0) {
    console.error('Case B failed; expected failure but got success');
    process.exit(1);
  }
  if (!/Both 'server' and 'src\/server' exist/.test(resB.stderr)) {
    console.error('Case B failed; expected explanatory message, got:', resB.stderr);
    process.exit(1);
  }
  console.log('Case B OK');

  // Case C: Duplicate routes -> fail (non-zero)
  const c = mkdtemp();
  touchDir(c, 'src/routes');
  touchDir(c, 'src/server/routes');
  const resC = spawnCheck(c);
  if (resC.status === 0) {
    console.error('Case C failed; expected failure but got success');
    process.exit(1);
  }
  if (!/Both 'src\/routes' and 'src\/server\/routes' exist/.test(resC.stderr)) {
    console.error('Case C failed; expected explanatory message, got:', resC.stderr);
    process.exit(1);
  }
  console.log('Case C OK');

  console.log('All tests passed');
}

run();
