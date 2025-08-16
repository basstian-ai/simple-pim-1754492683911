// scripts/check_server_layout.js
// Checks for duplicate server/route directories and fails with guidance.
// Usage:
//   node scripts/check_server_layout.js            # checks repo root
//   node scripts/check_server_layout.js --root path
//   node scripts/check_server_layout.js --run-tests

const fs = require('fs');
const path = require('path');

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function absRoot(root) {
  return path.resolve(process.cwd(), root || '.');
}

function checkLayout(root) {
  // pairs to detect duplicates (left vs right)
  const pairs = [
    ['server', 'src/server'],
    ['routes', 'src/server/routes'],
    ['src/routes', 'src/server/routes']
  ];

  const found = [];
  pairs.forEach(([a, b]) => {
    const pa = path.join(root, a);
    const pb = path.join(root, b);
    if (isDir(pa) && isDir(pb)) found.push({ left: a, right: b, leftPath: pa, rightPath: pb });
  });

  const result = { ok: found.length === 0, duplicates: found };
  return result;
}

function printGuidance(dupes) {
  console.error('\nDuplicate server layout detected.');
  console.error('This repository contains more than one directory that appear to provide server or route code.');
  console.error('Having duplicate server paths (e.g. server vs src/server) causes ambiguity and import/packaging issues.');
  console.error('\nDetected duplicates:');
  dupes.forEach(d => {
    console.error(`- Both '${d.left}' and '${d.right}' exist`);
  });

  console.error('\nRecommended canonical layout:');
  console.error("- Use 'src/server' (and 'src/server/routes') as the canonical server location.");
  console.error('\nSuggested remediation steps:');
  console.error("1) Decide which directory to keep (recommended: 'src/server').");
  console.error("2) Move or rename the other files into the canonical location. Example:");
  console.error("   git mv server/* src/server/  # or git mv src/server/* server/ if you choose 'server' as canonical");
  console.error("   git commit -m \"chore(structure): consolidate server code into src/server\"");
  console.error("3) Update any imports or paths that referenced the old location, and run tests/CI.");
  console.error('\nIf you intentionally have both sets (for example, a compatibility shim), document it in docs/server-layout.md and add an explicit opt-out in .github/workflows to avoid CI failures.');
  console.error('\nTo bypass the CI check (not recommended), you can update the workflow or add an opt-out file at .ci/ignore-server-layout-check');
}

function runTests() {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-check-'));
  const scenarios = [];

  // Scenario A: both server and src/server exist -> should be duplicate
  const sa = path.join(tmp, 'a');
  fs.mkdirSync(sa);
  fs.mkdirSync(path.join(sa, 'server'));
  fs.mkdirSync(path.join(sa, 'src'));
  fs.mkdirSync(path.join(sa, 'src', 'server'));
  scenarios.push({ root: sa, expectOk: false });

  // Scenario B: only src/server exists -> ok
  const sb = path.join(tmp, 'b');
  fs.mkdirSync(sb);
  fs.mkdirSync(path.join(sb, 'src'));
  fs.mkdirSync(path.join(sb, 'src', 'server'));
  scenarios.push({ root: sb, expectOk: true });

  // Scenario C: only server exists -> ok
  const sc = path.join(tmp, 'c');
  fs.mkdirSync(sc);
  fs.mkdirSync(path.join(sc, 'server'));
  scenarios.push({ root: sc, expectOk: true });

  // Scenario D: duplicate routes (src/routes and src/server/routes)
  const sd = path.join(tmp, 'd');
  fs.mkdirSync(sd);
  fs.mkdirSync(path.join(sd, 'src'));
  fs.mkdirSync(path.join(sd, 'src', 'routes'));
  fs.mkdirSync(path.join(sd, 'src', 'server'));
  fs.mkdirSync(path.join(sd, 'src', 'server', 'routes'));
  scenarios.push({ root: sd, expectOk: false });

  let failures = 0;
  scenarios.forEach((s, idx) => {
    const res = checkLayout(s.root);
    const ok = res.ok;
    const expected = s.expectOk;
    if (ok !== expected) {
      console.error(`Test ${idx + 1} failed for root=${s.root}: expected ok=${expected} got ok=${ok}`);
      if (!ok && res.duplicates.length) console.error('  duplicates: ', res.duplicates.map(d => `${d.left}<->${d.right}`).join(', '));
      failures++;
    } else {
      console.log(`Test ${idx + 1} passed`);
    }
  });

  // clean up (best-effort)
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}

  if (failures) {
    console.error(`\n${failures} test(s) failed`);
    return false;
  }
  console.log('\nAll tests passed');
  return true;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const runTestsFlag = argv.includes('--run-tests');
  const rootIndex = argv.indexOf('--root');
  const rootArg = rootIndex >= 0 ? argv[rootIndex + 1] : null;
  const root = absRoot(rootArg || '.');

  if (runTestsFlag) {
    const ok = runTests();
    process.exit(ok ? 0 : 2);
  }

  const result = checkLayout(root);
  if (result.ok) {
    console.log('Server layout sanity check: OK — no duplicate server/route directories found');
    process.exit(0);
  } else {
    printGuidance(result.duplicates);
    process.exit(1);
  }
}

module.exports = { checkLayout, printGuidance, runTests };