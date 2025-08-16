'use strict'

// Simple validator for API route file naming & placement.
// Usage: node tools/validate-api-routes.js
// Exports lintFilePaths(filePaths) for unit testing.

const fs = require('fs')
const path = require('path')

// Acceptable file extensions
const EXT_REGEX = /\.(js|ts|jsx|tsx)$/i
// Kebab-case filename (no directories) e.g. fetch-product.ts
const FILENAME_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isApiDirCandidate(p) {
  const lower = p.toLowerCase()
  return (
    lower.endsWith(path.join('pages', 'api')) ||
    lower.endsWith(path.join('src', 'pages', 'api')) ||
    lower.endsWith(path.join('app', 'api')) ||
    lower.endsWith(path.join('src', 'app', 'api')) ||
    lower.endsWith(path.join('server', 'routes')) ||
    lower.endsWith(path.join('src', 'server', 'routes'))
  )
}

function walkDir(root) {
  const result = []
  const stack = [root]
  while (stack.length) {
    const cur = stack.pop()
    let stat
    try {
      stat = fs.statSync(cur)
    } catch (e) {
      continue
    }
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(cur).map(e => path.join(cur, e))
      for (const e of entries) stack.push(e)
    } else if (stat.isFile()) {
      result.push(cur)
    }
  }
  return result
}

function findApiRouteFiles(root = process.cwd()) {
  // Search for directories matching our candidate list then collect files under them
  const found = []
  const allDirsToCheck = []

  // Common roots we'll probe
  const probes = [
    path.join(root, 'pages', 'api'),
    path.join(root, 'src', 'pages', 'api'),
    path.join(root, 'app', 'api'),
    path.join(root, 'src', 'app', 'api'),
    path.join(root, 'server', 'routes'),
    path.join(root, 'src', 'server', 'routes')
  ]

  for (const p of probes) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      allDirsToCheck.push(p)
    }
  }

  for (const dir of allDirsToCheck) {
    const files = walkDir(dir)
    for (const f of files) {
      if (EXT_REGEX.test(f)) found.push(f)
    }
  }

  return found
}

function lintFilePaths(filePaths) {
  const violations = []

  for (const fullpath of filePaths) {
    const parsed = path.parse(fullpath)
    const filename = parsed.name // without extension
    const ext = parsed.ext || ''

    if (!EXT_REGEX.test(ext)) {
      // skip non-js/ts files
      continue
    }

    // allow index files at directory root but still enforce kebab-case for their parent dir name
    if (filename.toLowerCase() === 'index') {
      // check parent directory name
      const parent = path.basename(parsed.dir)
      if (!FILENAME_REGEX.test(parent)) {
        violations.push({
          file: fullpath,
          reason: `parent directory name "${parent}" should be kebab-case (a-z0-9 and hyphens only)`
        })
      }
      continue
    }

    // Normal file: enforce kebab-case name
    if (!FILENAME_REGEX.test(filename)) {
      violations.push({ file: fullpath, reason: `filename "${filename}${ext}" is not kebab-case. Use lowercase letters, numbers and hyphens only.` })
    }
  }

  return violations
}

// CLI
if (require.main === module) {
  const root = process.cwd()
  const files = findApiRouteFiles(root)
  if (!files.length) {
    console.log('No API route folders found (skipping).')
    process.exit(0)
  }

  const violations = lintFilePaths(files)
  if (violations.length) {
    console.error('\nAPI route naming violations found:')
    for (const v of violations) {
      console.error(` - ${path.relative(root, v.file)}: ${v.reason}`)
    }
    console.error('\nPlease rename files or parent directories to kebab-case (e.g. my-route.ts)')
    process.exit(2)
  }

  console.log('API route validation passed. All filenames are kebab-case where applicable.')
  process.exit(0)
}

module.exports = { findApiRouteFiles, lintFilePaths }
