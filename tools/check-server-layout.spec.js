'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');

function runInTemp(makeDirs) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-layout-'));
  try {
    // create the requested directories
    for (const d of makeDirs) {
      const p = path.join(tmp, d);
      fs.mkdirSync(p, { recursive: true });
    }

    const script = path.join(__dirname, 'check-server-layout.js');
    const res = child.spawnSync(process.execPath, [script], { cwd: tmp, encoding: 'utf8' });
    return { code: res.status, stdout: res.stdout, stderr: res.stderr };
  } finally {
    // best-effort cleanup
    try {
      fs.rmSync(tmp, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

// 1) No duplicates -> exit code 0
const r1 = runInTemp([ /* empty */ ]);
assert(r1.code === 0, 'Expected success when no directories exist: ' + JSON.stringify(r1));

// 2) Duplicate server vs src/server -> expect non-zero (2)
const r2 = runInTemp(['server', path.join('src', 'server')]);
assert(r2.code === 2, 'Expected failure when both server and src/server exist: ' + JSON.stringify(r2));

// 3) Duplicate src/routes vs src/server/routes -> expect non-zero
const r3 = runInTemp([path.join('src', 'routes'), path.join('src', 'server', 'routes')]);
assert(r3.code === 2, 'Expected failure when both src/routes and src/server/routes exist: ' + JSON.stringify(r3));

console.log('All self-tests passed for tools/check-server-layout.js');
