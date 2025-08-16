#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

const repoRoot = process.cwd();
const normalize = (p) => path.normalize(path.join(repoRoot, p));

// Pairs of potential duplicate locations to guard against
const pairs = [
  ["server", "src/server"],
  ["src/routes", "src/server/routes"],
  ["server/routes", "src/server/routes"],
  ["routes", "src/routes"]
];

const duplicates = [];
for (const [a, b] of pairs) {
  const pa = normalize(a);
  const pb = normalize(b);
  if (isDir(pa) && isDir(pb)) duplicates.push({ a, b });
}

if (duplicates.length === 0) {
  console.log("OK: no duplicate server/route directories found.");
  console.log("Canonical server layout: src/server (recommended). See docs/server-layout.md for details.");
  process.exit(0);
}

console.error("\nERROR: Duplicate server/route directories detected. Please consolidate to a single canonical location (recommended: 'src/server').\n");
for (const d of duplicates) {
  console.error(` - both '${d.a}' and '${d.b}' exist`);
}

console.error("\nSuggested actions:\n");
console.error("  1) Choose canonical location (we recommend 'src/server').\n  2) Move files into the canonical path (git mv).\n  3) Update imports (search/replace or path alias).\n  4) Remove the old duplicate directory once everything compiles/tests pass.\n");
console.error("See docs/server-layout.md for a migration checklist and examples.\n");

// Exit non-zero to fail CI / pre-push hooks
process.exit(2);
