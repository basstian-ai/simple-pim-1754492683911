'use strict';

const fs = require('fs');
const path = require('path');

// Usage: node tools/check-structure.js [--root path]
// Exits with code 0 when OK, 2 when duplicates found, 1 for other errors.

function exists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function joinRoot(relRoot, p) {
  return path.resolve(relRoot, p);
}

function run(root) {
  const pairs = [
    // pair format: [pathA, pathB, messageIfBothExist]
    ['server', 'src/server', 'Both top-level "server" and "src/server" directories exist. Choose a single canonical location (recommended: "src/server").'],
    ['routes', 'src/routes', 'Both top-level "routes" and "src/routes" directories exist. Choose a single canonical location (recommended: "src/server/routes" or "src/routes").'],
    ['server/routes', 'src/server/routes', 'Both "server/routes" and "src/server/routes" directories exist. Choose one canonical location.'],
    ['routes', 'src/server/routes', 'Both top-level "routes" and "src/server/routes" directories exist. Choose one canonical location.'],
    ['src/routes', 'src/server/routes', 'Both "src/routes" and "src/server/routes" directories exist. Consolidate route files into a single directory.']
  ];

  const collisions = [];
  for (const [a, b, msg] of pairs) {
    const aPath = joinRoot(root, a);
    const bPath = joinRoot(root, b);
    if (exists(aPath) && exists(bPath)) {
      collisions.push({a: aPath, b: bPath, msg});
    }
  }

  if (collisions.length === 0) {
    console.log('OK: No duplicate server/route directories detected.');
    return 0;
  }

  console.error('ERROR: Duplicate server/route directories detected:');
  for (const c of collisions) {
    console.error(` - ${c.a}  <->  ${c.b}`);
    console.error(`   > ${c.msg}`);
  }

  console.error('\nGuidance:');
  console.error(' - Pick a single canonical location for server logic. Recommended: src/server (and place routes under src/server/routes).');
  console.error(' - Move files using: git mv <old> <new>  (preserves history).');
  console.error(' - Update imports to the new paths (search for references to "../server" or "../routes").');
  console.error(' - See docs/server-layout.md for migration steps and CI enforcement.');

  return 2;
}

(function main() {
  try {
    const argv = process.argv.slice(2);
    let root = process.cwd();
    for (let i = 0; i < argv.length; i++) {
      if (argv[i] === '--root' && argv[i + 1]) {
        root = path.resolve(argv[i + 1]);
        i++;
      }
    }
    const code = run(root);
    process.exit(code);
  } catch (err) {
    console.error('check-structure failed:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
