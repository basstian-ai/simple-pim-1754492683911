'use strict';
const fs = require('fs');
const path = require('path');

// Exported function for use in tests/CI. Scans directories under root (non-recursive depth-limited)
// and finds multiple distinct directories that share the same final path segment (basename)
// for interesting basenames (server, routes).

const DEFAULT_IGNORE = new Set(['node_modules', '.git', '.venv', 'build', 'dist', '.next']);
const INTERESTING = new Set(['server', 'routes']);

async function readdirSafe(dir) {
  try {
    return await fs.promises.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return [];
  }
}

async function findDuplicateDirs(root) {
  root = path.resolve(root || process.cwd());
  const results = new Map(); // basename -> Set(paths)

  // We'll inspect two levels: entries at root, and if src exists, entries under src
  const rootEntries = await readdirSafe(root);

  async function inspectDir(dirPath) {
    const entries = await readdirSafe(dirPath);
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const name = ent.name;
      if (DEFAULT_IGNORE.has(name)) continue;
      // If basename is interesting, record
      if (INTERESTING.has(name)) {
        const abs = path.join(dirPath, name);
        const list = results.get(name) || new Set();
        list.add(abs);
        results.set(name, list);
      }
    }
  }

  // Inspect top-level
  await inspectDir(root);

  // If there's a src folder, inspect it as well
  const srcPath = path.join(root, 'src');
  if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
    await inspectDir(srcPath);
  }

  // Also inspect common nested location: src/server (to find src/server/routes)
  const potentialServer = path.join(root, 'src', 'server');
  if (fs.existsSync(potentialServer) && fs.statSync(potentialServer).isDirectory()) {
    const entries = await readdirSafe(potentialServer);
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const name = ent.name;
      if (INTERESTING.has(name)) {
        const abs = path.join(potentialServer, name);
        const list = results.get(name) || new Set();
        list.add(abs);
        results.set(name, list);
      }
    }
  }

  // Convert sets to arrays for easier consumption
  const out = {};
  for (const [k, set] of results.entries()) {
    if (set.size > 1) out[k] = Array.from(set).sort();
  }
  return out;
}

async function runCli() {
  const root = process.argv[2] || process.cwd();
  const dup = await findDuplicateDirs(root);
  const keys = Object.keys(dup);
  if (keys.length === 0) {
    console.log('OK: no duplicate server/routes directories detected');
    return 0;
  }

  console.error('ERROR: duplicate directories detected for the following basenames:');
  for (const k of keys) {
    console.error(`- ${k}:`);
    for (const p of dup[k]) console.error(`    ${p}`);
  }

  console.error('\nGuidance: choose a single canonical layout (recommended: src/server) and consolidate duplicates.');
  return 2;
}

if (require.main === module) {
  runCli().then(code => process.exit(code)).catch(err => {
    console.error('check-duplicate-server-dirs: unexpected error', err);
    process.exit(3);
  });
}

module.exports = { findDuplicateDirs };
