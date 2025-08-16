#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.ROOT || process.argv[2] || process.cwd();
const serverTop = path.join(root, 'server');
const serverSrc = path.join(root, 'src', 'server');
const routesSrc = path.join(root, 'src', 'routes');
const routesSrcServer = path.join(root, 'src', 'server', 'routes');

function existsDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

const errors = [];

if (existsDir(serverTop) && existsDir(serverSrc)) {
  errors.push(`Both '${path.relative(root, serverTop)}' and '${path.relative(root, serverSrc)}' exist. Choose 'src/server' as the canonical location and migrate code into it.`);
}

if (existsDir(routesSrc) && existsDir(routesSrcServer)) {
  errors.push(`Both '${path.relative(root, routesSrc)}' and '${path.relative(root, routesSrcServer)}' exist. Merge route definitions into a single routes directory under 'src/server' (preferred).`);
}

// Helper to detect immediate-child name overlaps (these often indicate duplicated modules)
function overlappingChildren(dirA, dirB) {
  try {
    const a = fs.readdirSync(dirA);
    const b = fs.readdirSync(dirB);
    const setB = new Set(b);
    return a.filter(x => setB.has(x));
  } catch (e) {
    return [];
  }
}

if (existsDir(serverTop) && existsDir(serverSrc)) {
  const common = overlappingChildren(serverTop, serverSrc);
  if (common.length) {
    errors.push(`Overlapping entries in 'server' and 'src/server': ${common.join(', ')}. These are likely duplicated code paths.`);
  }
}

if (existsDir(routesSrc) && existsDir(routesSrcServer)) {
  const common = overlappingChildren(routesSrc, routesSrcServer);
  if (common.length) {
    errors.push(`Overlapping entries in 'src/routes' and 'src/server/routes': ${common.join(', ')}. These are likely duplicated route files.`);
  }
}

if (errors.length) {
  console.error('ERROR: Duplicate server/route layout detected:');
  errors.forEach(e => console.error(' - ' + e));
  console.error('\nRecommended action: consolidate server and route code into a single canonical path (recommended: src/server).');
  console.error("See docs/server-structure.md for migration steps and examples.");
  process.exit(2);
}

console.log("OK: No duplicate server/route directories detected.");
process.exit(0);
