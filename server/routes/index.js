// SHIM - DO NOT EDIT
// Re-export routes from src/server/routes so imports targeting server/routes continue to work.

try {
  module.exports = require('../../src/server/routes');
} catch (err) {
  throw new Error('server/routes/index.js shim cannot find src/server/routes. Move routes into src/server/routes or update imports. Original error: ' + err.message);
}
