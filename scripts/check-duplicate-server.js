#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Usage:
//   node scripts/check-duplicate-server.js [--root <path>]
// If --root is omitted the repository root (process.cwd()) is used.

function resolveRoot() {
  const argv = process.argv.slice(2);
  const rootFlagIndex = argv.indexOf('--root');
  if (rootFlagIndex !== -1 && argv[rootFlagIndex + 1]) {
    return path.resolve(argv[rootFlagIndex + 1]);
  }
  // allow passing a single positional root for convenience
  if (argv.length === 1 && !argv[0].startsWith('--')) return path.resolve(argv[0]);
  return process.cwd();
}

const root = resolveRoot();

function exists(p) {
  try {
    return fs.existsSync(path.join(root, p));
  } catch (err) {
    return false;
  }
}

// Canonical layout chosen by team: src/server is canonical. If your repo uses a different
// convention, update the docs or this script accordingly.
const canonicalServer = 'src/server';
const altServer = 'server';

const canonicalRoutes = 'src/routes';
const altRoutes = 'server/routes';
const nestedServerRoutes = 'src/server/routes';

const found = {
  canonicalServer: exists(canonicalServer),
  altServer: exists(altServer),
  canonicalRoutes: exists(canonicalRoutes),
  altRoutes: exists(altRoutes),
  nestedServerRoutes: exists(nestedServerRoutes)
};

const problems = [];

if (found.canonicalServer && found.altServer) {
  problems.push(`Both "${canonicalServer}" and "${altServer}" exist.`);
}

// Routes duplicates
if (found.canonicalRoutes && found.nestedServerRoutes) {
  problems.push(`Both "${canonicalRoutes}" and "${nestedServerRoutes}" exist.`);
}
if (found.altRoutes && found.nestedServerRoutes) {
  problems.push(`Both "${altRoutes}" and "${nestedServerRoutes}" exist.`);
}
if (found.altRoutes && found.canonicalRoutes) {
  problems.push(`Both "${altRoutes}" and "${canonicalRoutes}" exist.`);
}

if (problems.length === 0) {
  console.log(`✅ Server layout check OK (root: ${root})`);
  process.exit(0);
}

console.error('❌ Server layout regression detected');
console.error(`Repository root: ${root}`);
console.error('Detected the following issues:');
for (const p of problems) console.error(' - ' + p);

console.error('\nRecommended canonical layout:');
console.error(` - Use "${canonicalServer}" as the single canonical server code directory.`);
console.error(' - Keep top-level "server/" removed or redirected as part of consolidation.');

console.error('\nSuggested consolidation steps (example commands):');
console.error('  # 1) Create a branch for the consolidation');
console.error('  git checkout -b consolidate/server-layout');
console.error('');
console.error('  # 2) Move files from the alternate location into the canonical one (use git mv to preserve history)');
console.error(`  # If your alternate layout is "${altServer}" -> move to "${canonicalServer}"`);
console.error(`  git mv ${altServer} ${canonicalServer} || rsync -a ${altServer}/ ${canonicalServer}/ && git add -A && git rm -r ${altServer}`);
console.error('');
console.error('  # 3) Update imports/path references (search/replace) - examples:');
console.error('  # - Replace imports from "server/..." to the new path (project-specific).');
console.error('  # - Use your IDE/project-wide search or codemod for deterministic updates.');
console.error('');
console.error('  # 4) Run tests and CI, iterate on missing path fixes.');
console.error('  npm test
  # or your repo-specific test command');

console.error('\nHelpful tips:');
console.error(' - Prefer small, incremental moves (component-by-component) and keep PRs focused.');
console.error(' - Preserve git history with git mv when possible.');
console.error(' - Update any path aliases (tsconfig/webpack/babel) if they point at the old layout.');
console.error(' - Add this check to CI to prevent future regressions (see .github/workflows/ci-check-server-consolidation.yml).');

process.exit(1);
