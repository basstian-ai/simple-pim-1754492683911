// scripts/check-server-layout.js
// Non-destructive pre-PR / CI check to detect duplicate server/route directories.
// Canonical layout chosen by this repo: "src/server" (server logic under src/server, routes under src/server/routes)
// This script exits with code 1 and prints actionable guidance if it detects duplicate paths that must be consolidated.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}

function relative(p) {
  return path.relative(process.cwd(), p) || '.';
}

const root = process.cwd();
const candidates = {
  rootServer: path.join(root, 'server'),
  srcServer: path.join(root, 'src', 'server'),
  rootRoutes: path.join(root, 'routes'),
  srcRoutes: path.join(root, 'src', 'routes'),
};

const found = {
  rootServer: exists(candidates.rootServer),
  srcServer: exists(candidates.srcServer),
  rootRoutes: exists(candidates.rootRoutes),
  srcRoutes: exists(candidates.srcRoutes),
};

const issues = [];

// Rule: canonical server location is src/server. If both root/server and src/server coexist -> issue.
if (found.rootServer && found.srcServer) {
  issues.push({
    type: 'duplicate-server',
    message: `Found both ${relative(candidates.rootServer)} and ${relative(candidates.srcServer)}. Please consolidate server code into src/server.`
  });
}

// Rule: canonical routes location is src/server/routes OR src/routes? We'll detect routes at root vs src/server/routes.
const srcServerRoutes = path.join(candidates.srcServer, 'routes');
const foundSrcServerRoutes = exists(srcServerRoutes);

if (found.rootRoutes && foundSrcServerRoutes) {
  issues.push({
    type: 'duplicate-routes',
    message: `Found both ${relative(candidates.rootRoutes)} and ${relative(srcServerRoutes)}. Please consolidate route files into ${relative(srcServerRoutes)}.`
  });
}

// Also catch plain src/routes vs src/server/routes duplicates
const srcRoutesPath = candidates.srcRoutes;
if (exists(srcRoutesPath) && foundSrcServerRoutes) {
  issues.push({
    type: 'duplicate-routes-src',
    message: `Found both ${relative(srcRoutesPath)} and ${relative(srcServerRoutes)}. Pick one canonical routes location (recommended: ${relative(srcServerRoutes)}).`
  });
}

if (issues.length === 0) {
  console.log('OK: server layout check passed. No duplicate server/route directories detected.');
  process.exit(0);
}

console.error('\nERROR: Server layout consolidation check found issues:');
issues.forEach((it, i) => {
  console.error(`\n${i + 1}) ${it.message}`);
});

console.error('\nGuidance to fix (non-destructive):');
console.error('- Choose the canonical layout: src/server (this repo standard).');
console.error('- Move files from the duplicate location into src/server preserving subpaths, e.g.:');
console.error("    git mv server/* src/server/  # then adapt imports and run tests");
console.error('- If you cannot move immediately, create a small forwarding module (non-preferred) or open a short-lived migration PR.');
console.error('- Update any import paths referencing top-level `server` or `routes` to point to `src/server` or `src/server/routes`.');
console.error('- Run the repository tests locally and CI before merging.');
console.error('\nAutomated assist (optional):');
console.error('- Use `git mv` to preserve history when relocating files.');
console.error('- After moving, remove the old directory once all references are updated.');

process.exit(1);
