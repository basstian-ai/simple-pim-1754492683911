'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { findDuplicateDirs } = require('../scripts/check-duplicate-server-dirs');

async function mkdirp(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function run() {
  const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'dup-test-'));
  try {
    // Create two server directories to simulate duplication
    const serverA = path.join(tmp, 'server');
    const serverB = path.join(tmp, 'src', 'server');
    await mkdirp(serverA);
    await mkdirp(serverB);

    // Also create two routes (one under src, one under src/server)
    const routesA = path.join(tmp, 'src', 'routes');
    const routesB = path.join(tmp, 'src', 'server', 'routes');
    await mkdirp(routesA);
    await mkdirp(routesB);

    const dup = await findDuplicateDirs(tmp);

    // Expect both 'server' and 'routes' keys
    assert.ok(dup.server, 'expected duplicate server key');
    assert.ok(Array.isArray(dup.server), 'server value should be array');
    assert.ok(dup.server.length >= 2, 'server should have at least two entries');

    assert.ok(dup.routes, 'expected duplicate routes key');
    assert.ok(dup.routes.length >= 2, 'routes should have at least two entries');

    console.log('OK - tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Test failed', err);
    process.exit(1);
  } finally {
    // best-effort cleanup
    // do not aggressively remove in case of permission issues
  }
}

if (require.main === module) run();
