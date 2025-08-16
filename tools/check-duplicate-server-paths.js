#!/usr/bin/env node

// tools/check-duplicate-server-paths.js
// Fails (exit code != 0) if duplicate server/route directories are detected.
// Canonical layout: src/server (and src/server/routes)

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

const checks = [
  {dup: 'server', canonical: 'src/server'},
  {dup: 'routes', canonical: 'src/server/routes'},
  {dup: 'src/routes', canonical: 'src/server/routes'},
  {dup: 'server/routes', canonical: 'src/server/routes'},
  // additional heuristics
  {dup: 'server', canonical: 'src/server/routes'}
];

const found = [];
for (const {dup, canonical} of checks) {
  if (existsDir(dup) && existsDir(canonical)) {
    found.push({dup, canonical});
  }
}

if (found.length === 0) {
  console.log('OK: No duplicate server/route directories detected.');
  process.exit(0);
}

console.error('\nERROR: Duplicate server/route directories detected.');
console.error('This repository enforces a single canonical server layout: "src/server" (and "src/server/routes").');
console.error('Found the following duplicate pairs:');
for (const f of found) {
  console.error(`  - duplicate: "${f.dup}"  <=>  canonical: "${f.canonical}"`);
}

console.error('\nRecommended consolidation steps (non-destructive manual guidance):');
console.error('  1) Pick the canonical path: src/server (and src/server/routes)');
console.error('  2) Move files from the duplicate path into the canonical path using git so history is preserved:');
console.error('       git mv <duplicate_path> <destination_path>');
console.error('     Example:');
console.error('       # move a top-level server directory into src/server (creates src/server if needed)');
console.error('       mkdir -p src && git mv server src/server');
console.error('       # move routes into src/server/routes');
console.error('       mkdir -p src/server && git mv routes src/server/routes');
console.error('\n  3) Update imports/usages:');
console.error('       - Search for imports referencing the old location and replace with the canonical path.');
console.error('       - Example (js/ts):');
console.error("           // BEFORE: import { foo } from '../../server/foo'\n           // AFTER:  import { foo } from '../../src/server/foo'");
console.error('       - Use codemods, ripgrep + sed, or an editor-aware replace for bulk edits.');
console.error('\n  4) Update tooling and config if needed (tsconfig paths, build scripts, start scripts).');
console.error('\n  5) Run tests & lint; iterate until green.');
console.error('\n  6) Push as a single PR with clear migration steps and a checklist in the PR description.');

console.error('\nCI note: This repository has a structure guard that will fail CI until duplicates are resolved.');
console.error('If you intentionally keep both layouts for a migration, add a TODO in the repository README and coordinate the migration PR.');

process.exit(2);
