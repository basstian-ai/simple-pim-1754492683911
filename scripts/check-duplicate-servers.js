// scripts/check-duplicate-servers.js
// Simple repository check that fails when duplicate server/route directories exist.
// Exit code 1 when duplicates are detected to block CI.

const fs = require('fs');
const path = require('path');

function existsDir(rel) {
  try {
    const p = path.resolve(process.cwd(), rel);
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

const duplicatePairs = [
  ['server', 'src/server'],
  ['routes', 'src/server/routes'],
  ['src/routes', 'src/server/routes'],
  ['server/routes', 'src/server/routes']
];

const found = [];
for (const [a, b] of duplicatePairs) {
  if (existsDir(a) && existsDir(b)) {
    found.push({ a, b });
  }
}

if (found.length === 0) {
  console.log('✅ No duplicate server/route directory pairs detected.');
  process.exit(0);
}

console.error('\n❌ Duplicate server/route directories detected:');
for (const { a, b } of found) {
  console.error(` - Both "${a}" and "${b}" exist`);
}

console.error('\nGuidance:');
console.error(' - Choose a single canonical location for server code (recommended: "src/server").');
console.error(' - Move files from the duplicate path into the canonical path (git mv), update any imports, and remove the leftover directory.');
console.error(' - You can run this check locally to validate the repo after migration: `node scripts/check-duplicate-servers.js`');
console.error('\nBlocking CI to prevent regressions until the duplicate paths are consolidated.');

process.exit(1);
