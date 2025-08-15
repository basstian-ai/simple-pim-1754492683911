#!/usr/bin/env node
// Lightweight repository scanner to help reviewers quickly find candidate files
// related to the Dry-Run JSON Preview feature. Intentionally dependency-free.

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const keywords = [
  'dry-run',
  'dryRun',
  'dry_run',
  'json preview',
  'preview',
  'transform',
  'transformSnippet',
  'snippet',
  'dryRunPreview',
  'dryRunJson',
  'dry_run_preview'
];

const skipDirs = new Set(['node_modules', '.git', '.venv', 'dist', 'build']);

async function walk(dir, cb) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (skipDirs.has(e.name)) continue;
      await walk(full, cb);
    } else if (e.isFile()) {
      await cb(full);
    }
  }
}

(async function main() {
  const matches = [];
  try {
    await walk(root, async (file) => {
      // only inspect text-like files under a modest size to remain fast
      try {
        const stat = await fs.promises.stat(file);
        if (stat.size > 200 * 1024) return; // skip >200KB files
        const text = await fs.promises.readFile(file, 'utf8');
        const lowered = text.toLowerCase();
        for (const kw of keywords) {
          if (lowered.includes(kw.toLowerCase())) {
            matches.push({ file: path.relative(root, file), keyword: kw });
            break;
          }
        }
      } catch (err) {
        // ignore read errors for binary or locked files
      }
    });
  } catch (err) {
    console.error('Error scanning repository:', err.message || err);
    process.exit(2);
  }

  const byFile = {};
  for (const m of matches) {
    byFile[m.file] = (byFile[m.file] || 0) + 1;
  }

  if (matches.length === 0) {
    console.log('dry-run-check: No candidate files found for keywords:', keywords.join(', '));
    console.log('Hints: Ensure the feature files are included in the PR and that naming uses one of the standard keywords.');
    process.exit(1);
  }

  console.log('dry-run-check: Found', Object.keys(byFile).length, 'files containing target keywords.');
  const sorted = Object.entries(byFile).sort((a, b) => b[1] - a[1]);
  for (const [file, count] of sorted.slice(0, 200)) {
    console.log(` - ${file}  (matched ${count} keyword(s))`);
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ found: true, files: Object.keys(byFile) }, null, 2));
  }

  // success
  process.exit(0);
})();
