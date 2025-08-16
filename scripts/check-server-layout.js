#!/usr/bin/env node
// Validate there are no duplicate server/route directories that would cause ambiguity.
// Fails (exit code != 0) when both legacy and canonical dirs exist so CI can block regressions.

const fs = require('fs');
const path = require('path');

function existsDir(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

const D_LEGACY_SERVER = 'server';
const D_SRC_SERVER = path.join('src', 'server');
const D_SRC_ROUTES = path.join('src', 'routes');
const D_SRC_SERVER_ROUTES = path.join('src', 'server', 'routes');

const legacyServer = existsDir(D_LEGACY_SERVER);
const srcServer = existsDir(D_SRC_SERVER);
const srcRoutes = existsDir(D_SRC_ROUTES);
const srcServerRoutes = existsDir(D_SRC_SERVER_ROUTES);

const failures = [];

if (legacyServer && srcServer) {
  failures.push(`Duplicate server directories found: "${D_LEGACY_SERVER}" and "${D_SRC_SERVER}". Choose a single canonical location (recommended: ${D_SRC_SERVER}) and remove the duplicate.`);
}

if (srcRoutes && srcServerRoutes) {
  failures.push(`Duplicate routes directories found: "${D_SRC_ROUTES}" and "${D_SRC_SERVER_ROUTES}". Choose a single canonical location (recommended: ${D_SRC_SERVER_ROUTES}) and remove the duplicate.`);
}

if (failures.length) {
  console.error('\nServer layout validation failed:');
  failures.forEach(f => console.error('- ' + f));
  console.error('\nGuidance: see docs/server-layout.md for migration steps and recommended layout.');
  process.exit(2);
}

console.log('Server layout validation passed.');
process.exit(0);
