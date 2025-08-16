#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(path.resolve(p));
  } catch (e) {
    return false;
  }
}

function findConflicts(root = process.cwd()) {
  const conflicts = [];
  const check = (a, b, desc) => {
    if (exists(path.join(root, a)) && exists(path.join(root, b))) {
      conflicts.push({ a, b, desc });
    }
  };

  // Primary duplicates we want to prevent
  check('server', 'src/server', 'duplicate top-level "server" and "src/server" directories');
  check('src/routes', 'src/server/routes', 'duplicate "src/routes" and "src/server/routes" directories');
  check('routes', 'src/server/routes', 'duplicate top-level "routes" and "src/server/routes" directories');

  return conflicts;
}

module.exports = { findConflicts };

if (require.main === module) {
  const root = process.argv[2] || process.cwd();
  const conflicts = findConflicts(root);
  if (conflicts.length) {
    console.error('\n✖ Server layout conflicts detected:\n');
    conflicts.forEach((c) => {
      console.error(` - ${c.desc}: ${c.a} ⟷ ${c.b}`);
    });

    console.error('\nAction: Consolidate to a single canonical location: "src/server".');
    console.error('See docs/server-layout.md for recommended migration steps.');
    process.exit(1);
  }
  console.log('✓ OK: no server layout conflicts found.');
  process.exit(0);
}
