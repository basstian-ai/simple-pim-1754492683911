'use strict';
const fs = require('fs');
const path = require('path');

function existsDir(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

// Returns an array of duplicate pairs found. Each entry is {a: relPathA, b: relPathB}
function findDuplicates(root) {
  root = root || process.cwd();
  const rel = p => path.join(root, p);

  // Common duplicate candidates observed across repos. Keep small and explicit.
  const pairs = [
    ['server', 'src/server'],
    ['src/routes', 'src/server/routes'],
    ['routes', 'src/server/routes']
  ];

  const duplicates = [];

  for (const [a, b] of pairs) {
    if (existsDir(rel(a)) && existsDir(rel(b))) {
      duplicates.push({ a, b });
    }
  }

  return duplicates;
}

module.exports = { findDuplicates };

if (require.main === module) {
  const duplicates = findDuplicates(process.cwd());
  if (duplicates.length === 0) {
    console.log('No duplicate server/route directory patterns found.');
    process.exit(0);
  }

  console.error('\nERROR: Duplicate server/route directory patterns detected.');
  for (const d of duplicates) {
    console.error(` - Duplicate pair: ${d.a}  <-->  ${d.b}`);
  }

  console.error('\nTo resolve: choose the canonical layout (recommended: src/server) and remove/merge the duplicate path(s). See docs/server-layout.md for guidance.');
  process.exit(1);
}
