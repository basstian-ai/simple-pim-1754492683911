// scripts/check-server-layout.js
// Runtime: Node.js (CommonJS)
// Exports a function for test harnesses and can be invoked as a CLI.
const fs = require('fs');
const path = require('path');

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function checkLayout(root = process.cwd()) {
  const serverDir = path.join(root, 'server');
  const srcServerDir = path.join(root, 'src', 'server');
  const hasServer = isDir(serverDir);
  const hasSrcServer = isDir(srcServerDir);

  if (hasServer && hasSrcServer) {
    const msg = [];
    msg.push('Duplicate server directories detected: both "server/" and "src/server/" exist.');
    msg.push('This repository should have a single canonical server directory to avoid ambiguity and import drift.');
    msg.push('Recommended canonical location: "src/server/"');
    msg.push('See docs/server-layout.md for migration guidance.');
    msg.push('To resolve, move code from "server/" into "src/server/" (or vice-versa), update imports, then remove the redundant directory.');
    msg.push('Automated CI check failed to prevent regressions — please consolidate before merging.');

    const error = new Error(msg.join('\n'));
    error.code = 'DUPLICATE_SERVER_DIRS';
    throw error;
  }

  // If only one exists or none exist, that's acceptable for this check.
  return true;
}

module.exports = { checkLayout };

if (require.main === module) {
  try {
    checkLayout(process.cwd());
    console.log('OK: server layout check passed.');
    process.exit(0);
  } catch (err) {
    console.error('ERROR: ' + (err && err.message ? err.message : String(err)));
    process.exit(2);
  }
}
