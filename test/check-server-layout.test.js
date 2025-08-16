const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const { findConflicts } = require('../scripts/check-server-layout');

function mkdtemp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'layout-check-'));
}

(function testNoConflict() {
  const dir = mkdtemp();
  fs.mkdirSync(path.join(dir, 'src', 'server'), { recursive: true });
  const conflicts = findConflicts(dir);
  assert.strictEqual(conflicts.length, 0, 'expected no conflicts when only src/server exists');
  console.log('testNoConflict ok');
})();

(function testServerVsSrcServerConflict() {
  const dir = mkdtemp();
  fs.mkdirSync(path.join(dir, 'server'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src', 'server'), { recursive: true });
  const conflicts = findConflicts(dir);
  assert(conflicts.length > 0, 'expected conflict when server and src/server both exist');
  const found = conflicts.some(c => c.a === 'server' && c.b === 'src/server');
  assert(found, 'expected server vs src/server conflict');
  console.log('testServerVsSrcServerConflict ok');
})();

(function testSrcRoutesConflict() {
  const dir = mkdtemp();
  fs.mkdirSync(path.join(dir, 'src', 'routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src', 'server', 'routes'), { recursive: true });
  const conflicts = findConflicts(dir);
  assert(conflicts.length > 0, 'expected conflict for src/routes vs src/server/routes');
  console.log('testSrcRoutesConflict ok');
})();

console.log('All tests passed');
