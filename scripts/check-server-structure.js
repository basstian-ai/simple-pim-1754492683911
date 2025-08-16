// scripts/check-server-structure.js
// Exit non-zero if duplicate server/route directories are detected.
// Canonical layout chosen by this repo: src/server (and src/server/routes)

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function rel(p) {
  return path.relative(process.cwd(), p) || '.';
}

const repoRoot = process.cwd();

const candidates = [
  {name: 'root-server', p: path.join(repoRoot, 'server')},
  {name: 'src-server', p: path.join(repoRoot, 'src', 'server')},
  {name: 'root-routes', p: path.join(repoRoot, 'routes')},
  {name: 'src-server-routes', p: path.join(repoRoot, 'src', 'server', 'routes')}
];

const present = {};
for (const c of candidates) present[c.name] = exists(c.p);

let ok = true;
const errors = [];

// Duplicate server directories: both ./server and ./src/server
if (present['root-server'] && present['src-server']) {
  ok = false;
  errors.push({
    title: 'Duplicate server directories found',
    detail: `Both "${rel(candidates[0].p)}" and "${rel(candidates[1].p)}" exist. Use a single canonical location for server code (recommended: src/server).`
  });
}

// Duplicate routes directories: ./src/routes vs ./src/server/routes (or root routes)
if (exists(path.join(repoRoot, 'src', 'routes')) && present['src-server-routes']) {
  ok = false;
  errors.push({
    title: 'Duplicate routes directories found',
    detail: `Both "${rel(path.join(repoRoot,'src','routes'))}" and "${rel(candidates[3].p)}" exist. Consolidate routes under a single location (recommended: src/server/routes).`
  });
}

// Root-level routes vs src/server/routes
if (present['root-routes'] && present['src-server-routes']) {
  ok = false;
  errors.push({
    title: 'Duplicate routes directories found',
    detail: `Both "${rel(candidates[2].p)}" and "${rel(candidates[3].p)}" exist. Consolidate routes under a single location (recommended: src/server/routes).`
  });
}

// Root-level server vs src/routes (odd mixes)
if (present['root-server'] && exists(path.join(repoRoot, 'src', 'routes')) ) {
  ok = false;
  errors.push({
    title: 'Mixed server/route layout',
    detail: `Found "${rel(candidates[0].p)}" and "${rel(path.join(repoRoot,'src','routes'))}". Prefer a single canonical layout to reduce ambiguity (recommended: move server into src/server and routes into src/server/routes).`
  });
}

if (ok) {
  console.log('OK: No duplicate server/route directories detected.');
  process.exit(0);
}

console.error('ERROR: Repository layout guard failed. See details below:\n');
for (const e of errors) {
  console.error(`- ${e.title}:`);
  console.error(`  ${e.detail}\n`);
}

console.error('Suggested migration (example):');
console.error('  # Move root server into src/server (preserve history):');
console.error('  git mv server src/server || mkdir -p src && git mv server src/server');
console.error('  # Or move src/server to server if you choose root as canonical:');
console.error('  git mv src/server server');
console.error('  # Move/merge routes accordingly:');
console.error('  git mv routes src/server/routes || git mv src/routes src/server/routes');
console.error('\nAfter performing moves, update imports and run tests. This CI guard enforces a single canonical place for server logic.');

process.exit(2);
