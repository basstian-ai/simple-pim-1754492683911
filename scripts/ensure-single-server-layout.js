'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Detect duplicate server/route directories in a repository.
 * Returns an array of detected duplicate pairs.
 *
 * Pairs checked:
 *  - server <-> src/server
 *  - src/routes <-> src/server/routes
 *  - server/routes <-> src/server/routes
 */
function findDuplicates(root = process.cwd()) {
  const abs = p => path.join(root, p);
  const check = p => fs.existsSync(abs(p)) && fs.statSync(abs(p)).isDirectory();

  const duplicates = [];

  if (check('server') && check('src/server')) {
    duplicates.push({a: 'server', b: 'src/server', reason: 'top-level server dir and src/server both exist'});
  }

  if (check('src/routes') && check('src/server/routes')) {
    duplicates.push({a: 'src/routes', b: 'src/server/routes', reason: 'routes present in both src/ and src/server/'});
  }

  if (check('server/routes') && check('src/server/routes')) {
    duplicates.push({a: 'server/routes', b: 'src/server/routes', reason: 'routes present in both server/ and src/server/'});
  }

  // generic: if both top-level server and top-level routes exist under different parents
  // check for server vs src/routes as well (edge cases)
  if (check('server') && check('src/routes')) {
    duplicates.push({a: 'server', b: 'src/routes', reason: 'potential overlap: server/ and src/routes/ both exist'});
  }

  return duplicates;
}

function cli(argv) {
  const root = process.cwd();
  const duplicates = findDuplicates(root);
  if (duplicates.length === 0) {
    console.log('✔ No duplicate server/route directories detected.');
    return 0;
  }

  console.error('\n✖ Duplicate server/route directories detected:');
  for (const d of duplicates) {
    console.error(` - ${d.a}  <->  ${d.b}`);
    console.error(`     reason: ${d.reason}`);
    console.error(`     suggestion: pick a canonical directory (recommended: src/server) and move/merge contents; update imports and tests.\n`);
  }

  console.error('See docs/server-layout.md for guidance and migration steps.');
  return 2;
}

if (require.main === module) {
  const code = cli(process.argv.slice(2));
  process.exit(code);
}

module.exports = { findDuplicates, cli };
