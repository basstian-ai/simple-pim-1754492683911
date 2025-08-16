'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const { findDuplicates } = require('../ensure-single-server-layout');

function tempRepo() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));
  return base;
}

function cleanup(dir) {
  // best-effort recursive remove
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry);
      const st = fs.lstatSync(p);
      if (st.isDirectory()) {
        cleanup(p);
      } else {
        try { fs.unlinkSync(p); } catch (e) {}
      }
    }
    try { fs.rmdirSync(dir); } catch (e) {}
  }
}

// Test 1: detect server vs src/server
(function testServerVsSrcServer() {
  const repo = tempRepo();
  try {
    fs.mkdirSync(path.join(repo, 'server'));
    fs.mkdirSync(path.join(repo, 'src'));
    fs.mkdirSync(path.join(repo, 'src', 'server'));

    const duplicates = findDuplicates(repo);
    assert(Array.isArray(duplicates), 'should return array');
    assert(duplicates.length >= 1, 'expected at least one duplicate');

    const pair = duplicates.find(p => p.a === 'server' && p.b === 'src/server');
    assert(pair, 'expected server <-> src/server duplicate');
    console.log('testServerVsSrcServer: ok');
  } finally {
    cleanup(repo);
  }
})();

// Test 2: detect src/routes vs src/server/routes
(function testRoutesDup() {
  const repo = tempRepo();
  try {
    fs.mkdirSync(path.join(repo, 'src'));
    fs.mkdirSync(path.join(repo, 'src', 'routes'));
    fs.mkdirSync(path.join(repo, 'src', 'server'));
    fs.mkdirSync(path.join(repo, 'src', 'server', 'routes'));

    const duplicates = findDuplicates(repo);
    assert(duplicates.length >= 1, 'expected route duplicates');

    const pair = duplicates.find(p => p.a === 'src/routes' && p.b === 'src/server/routes');
    assert(pair, 'expected src/routes <-> src/server/routes duplicate');
    console.log('testRoutesDup: ok');
  } finally {
    cleanup(repo);
  }
})();

console.log('All tests passed.');
