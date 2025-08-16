'use strict';

// tools/check-duplicate-server-paths.js
// Simple guard that fails CI when duplicate server/route directories exist.
// Recommended canonical layout: src/server

const fs = require('fs');
const path = require('path');

function existsDir(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

// Returns an array of conflict objects if duplicate paths are found.
function checkPaths(root = process.cwd()) {
  const conflicts = [];

  const checks = [
    { a: 'server', b: path.join('src', 'server') },
    { a: path.join('src', 'routes'), b: path.join('src', 'server', 'routes') },
    { a: 'routes', b: path.join('src', 'server', 'routes') },
    { a: path.join('server', 'routes'), b: path.join('src', 'server', 'routes') }
  ];

  for (const { a, b } of checks) {
    const pa = path.join(root, a);
    const pb = path.join(root, b);
    if (existsDir(pa) && existsDir(pb)) {
      conflicts.push({ left: a, right: b, message: `Both \"${a}\" and \"${b}\" exist` });
    }
  }

  return conflicts;
}

function run(root = process.cwd()) {
  const conflicts = checkPaths(root);
  if (conflicts.length) {
    console.error('ERROR: Duplicate server/route directory layout detected:');
    for (const c of conflicts) console.error(` - ${c.message}`);

    console.error('\nTo fix: consolidate to a single canonical location (recommended: \"src/server\") or remove the duplicate directories.');
    console.error('See docs/server-layout.md for migration guidance.');
    process.exit(1);
  }

  console.log('OK: No duplicate server/route directories detected.');
}

if (require.main === module) {
  run(process.cwd());
} else {
  module.exports = { checkPaths, run };
}
