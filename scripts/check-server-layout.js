'use strict';
const fs = require('fs');
const path = require('path');

// Script to detect duplicate/ambiguous server & routes directories
// Canonical choice: src/server (+ src/server/routes)
// Fail CI if ambiguous duplicates detected (e.g. both server and src/server)

function exists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function rel(p) {
  return path.relative(process.cwd(), p) || '.';
}

function main() {
  const root = path.resolve(__dirname, '..');
  const candidates = {
    top_server: path.join(root, 'server'),
    top_routes: path.join(root, 'routes'),
    src_server: path.join(root, 'src', 'server'),
    src_server_routes: path.join(root, 'src', 'server', 'routes'),
    src_routes: path.join(root, 'src', 'routes')
  };

  const found = Object.entries(candidates).filter(([, p]) => exists(p)).map(([k, p]) => ({ key: k, path: p }));

  if (found.length === 0) {
    console.log('OK: No server/routes directories detected (nothing to consolidate).');
    process.exit(0);
  }

  // Rules: prefer src/server as canonical. Error when more than one of the following namespaces exist:
  // {server, src/server}, {routes, src/server/routes}, {src/routes, src/server/routes}

  const problems = [];

  const has = key => found.some(f => f.key === key);

  if (has('top_server') && has('src_server')) {
    problems.push({
      reason: 'Duplicate server directories',
      details: [`Both '${rel(candidates.top_server)}' and '${rel(candidates.src_server)}' exist.`],
      suggestion: `Choose a canonical location (recommended: 'src/server'). To move top-level server into src/server:

  git mv ${rel(candidates.top_server)} ${rel(path.join(root, 'src'))}/server
  # then update imports that used absolute top-level paths, run tests.
`
    });
  }

  if ((has('top_routes') || has('src_routes')) && has('src_server_routes')) {
    const dupPaths = [];
    if (has('top_routes')) dupPaths.push(rel(candidates.top_routes));
    if (has('src_routes')) dupPaths.push(rel(candidates.src_routes));
    problems.push({
      reason: 'Duplicate routes directories',
      details: [`${dupPaths.join(' and ')} and ${rel(candidates.src_server_routes)} exist.`],
      suggestion: `Consolidate route files under 'src/server/routes' (recommended). Example move:

  git mv ${dupPaths.map(p => p).join(' ')} ${rel(path.join(root, 'src', 'server'))}/routes
  # ensure imports referencing '/routes' are updated accordingly
`
    });
  }

  // If both top-level server and top-level routes exist but src/server does not, suggest canonical src/server
  if (has('top_server') && has('top_routes') && !has('src_server')) {
    problems.push({
      reason: 'Top-level server+routes found',
      details: [`Both '${rel(candidates.top_server)}' and '${rel(candidates.top_routes)}' are present.`],
      suggestion: `Consider migrating to 'src/server' as canonical server code path. Example:

  mkdir -p src/server
  git mv ${rel(candidates.top_server)} src/server
  git mv ${rel(candidates.top_routes)} src/server/routes
`
    });
  }

  if (problems.length === 0) {
    console.log('OK: No conflicting server/routes layouts detected. Present directories:');
    found.forEach(f => console.log(` - ${rel(f.path)}`));
    process.exit(0);
  }

  console.error('\nERROR: Ambiguous server/routes layout detected. Please consolidate to a single canonical location (recommended: src/server).\n');
  problems.forEach(p => {
    console.error('---');
    console.error('Issue:', p.reason);
    p.details.forEach(d => console.error('  ', d));
    console.error('\nSuggested remediation:\n');
    console.error(p.suggestion);
  });

  console.error('\nGuidance: pick a single canonical path for server logic (we recommend src/server and src/server/routes).');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { main };