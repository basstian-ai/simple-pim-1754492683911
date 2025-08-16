#!/usr/bin/env node
// scripts/check-duplicate-server.mjs
// Lightweight check to detect duplicate server/route directories and fail CI if found.
// Canonical layout enforced by this project: use `src/server` and `src/server/routes` (not top-level `server` or `src/routes`).

import fs from 'fs/promises';
import path from 'path';

async function exists(p) {
  try {
    const st = await fs.stat(p);
    return st && st.isDirectory();
  } catch (err) {
    return false;
  }
}

function plural(n) {
  return n === 1 ? '' : 's';
}

async function main() {
  const root = process.cwd();

  const candidates = [
    { label: 'root server', path: path.join(root, 'server') },
    { label: 'src/server', path: path.join(root, 'src', 'server') },
    { label: 'src/routes', path: path.join(root, 'src', 'routes') },
    { label: 'src/server/routes', path: path.join(root, 'src', 'server', 'routes') }
  ];

  const found = [];
  for (const c of candidates) {
    if (await exists(c.path)) found.push(c);
  }

  const errors = [];

  // Rule: prefer src/server (canonical). If both root server and src/server exist -> error.
  const rootServer = found.find(f => f.label === 'root server');
  const srcServer = found.find(f => f.label === 'src/server');
  if (rootServer && srcServer) {
    errors.push({
      title: 'Duplicate server directories',
      msg: `Both 
  - ${path.relative(root, rootServer.path)}
  - ${path.relative(root, srcServer.path)}
exist. This repository enforces a single canonical server location: src/server.
Please consolidate into src/server (move code from the top-level server into src/server) and remove the duplicate directory.
`});
  }

  // Rule: prefer src/server/routes. If src/routes and src/server/routes both exist -> error.
  const srcRoutes = found.find(f => f.label === 'src/routes');
  const srcServerRoutes = found.find(f => f.label === 'src/server/routes');
  if (srcRoutes && srcServerRoutes) {
    errors.push({
      title: 'Duplicate routes directories',
      msg: `Both 
  - ${path.relative(root, srcRoutes.path)}
  - ${path.relative(root, srcServerRoutes.path)}
exist. Keep routes under the canonical server path: src/server/routes.
Please consolidate route files into src/server/routes and remove the duplicate directory.
`});
  }

  // If root server exists but src/server does not, warn (not error) but suggest migration.
  if (rootServer && !srcServer) {
    errors.push({
      title: 'Non-canonical server location',
      msg: `A top-level ${path.relative(root, rootServer.path)} directory exists but no ${path.relative(root, 'src/server')} was found.
The recommended canonical layout for this repo is to keep server code under src/server.
Consider moving ${path.relative(root, rootServer.path)} -> src/server and updating imports/paths.
`});
  }

  // If src/routes exists but no src/server/routes, suggest moving into src/server/routes.
  if (srcRoutes && !srcServerRoutes) {
    errors.push({
      title: 'Non-canonical routes location',
      msg: `A ${path.relative(root, srcRoutes.path)} directory exists but no ${path.relative(root, 'src/server/routes')} was found.
We prefer routes colocated under src/server/routes. Consider moving route files into src/server/routes.
`});
  }

  if (errors.length === 0) {
    console.log('check-duplicate-server: OK — no duplicate server/route directories detected.');
    process.exit(0);
  }

  console.error('check-duplicate-server: PROBLEMS FOUND:\n');
  for (const e of errors) {
    console.error('--- ' + e.title + '\n');
    console.error(e.msg + '\n');
  }

  console.error('To fix: choose the canonical location `src/server` (and `src/server/routes`) and consolidate code there.');
  process.exit(1);
}

main().catch(err => {
  console.error('check-duplicate-server: unexpected error:', err);
  process.exit(2);
});
