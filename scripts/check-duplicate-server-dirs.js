#!/usr/bin/env node
// scripts/check-duplicate-server-dirs.js
// Simple CI check to detect duplicate server/route directories that can cause ambiguity
// and import confusion. Exits with non-zero code when duplicates are found.

const fs = require('fs');
const path = require('path');

function existsDir(rel) {
  try {
    const s = fs.statSync(path.resolve(process.cwd(), rel));
    return s.isDirectory() || s.isSymbolicLink();
  } catch (err) {
    return false;
  }
}

const pairs = [
  ["server", path.join("src", "server")],
  ["routes", path.join("src", "routes")],
  [path.join("server", "routes"), path.join("src", "server", "routes")]
];

const conflicts = [];
for (const [a, b] of pairs) {
  if (existsDir(a) && existsDir(b)) {
    conflicts.push({a, b});
  }
}

if (conflicts.length === 0) {
  console.log("✅ No duplicate server/route directories detected.");
  process.exit(0);
}

console.error("\n❌ Duplicate server/route directory layout detected. Please consolidate to a single canonical layout.\n");
for (const c of conflicts) {
  console.error(`- Both '${c.a}' and '${c.b}' exist.`);
}

console.error("\nRecommended canonical layout: 'src/server' (and 'src/server/routes' / 'src/routes' under src).\n");
console.error("Suggested remediation (review before running):");
console.error("  1) Decide the canonical location (recommended: src/server).");
console.error("  2) Move sources from the non-canonical dir into src/, updating imports as needed. Example:");
console.error("       git mv server src/server    # if you choose src/server as canonical\n");
console.error("  3) Run tests and dev server to validate changes.\n");
console.error("If you intentionally maintain both layouts for compatibility, add a comment in repo docs explaining why and update CI to exempt this check.\n");

// Offer a hint to developers about a local quick-check command
console.error("Run: node scripts/check-duplicate-server-dirs.js\n");
process.exit(1);
