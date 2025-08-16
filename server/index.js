// SHIM - DO NOT EDIT
// This file is a lightweight compatibility shim so code that imports from the top-level
// `server` path continues to work while the canonical server implementation lives in src/server.
// Move implementation into src/server and keep this file only as a re-export.

try {
  module.exports = require('../src/server');
} catch (err) {
  // Provide a helpful error for devs who still reference server/ while the canonical code hasn't been added.
  throw new Error('server/index.js shim cannot find src/server. Move your server code into src/server or update imports. Original error: ' + err.message);
}
