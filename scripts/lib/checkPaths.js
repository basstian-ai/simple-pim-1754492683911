'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Check for duplicate server/route directory layouts.
 * Returns an array with issue messages (empty if no issues).
 *
 * rootDir: directory to run checks from (project root)
 */
function findDuplicateServerPaths(rootDir) {
  const issues = [];

  const pathsToCheck = [
    { a: path.join(rootDir, 'server'), b: path.join(rootDir, 'src', 'server'), canonical: path.join('src', 'server') },
    { a: path.join(rootDir, 'src', 'routes'), b: path.join(rootDir, 'src', 'server', 'routes'), canonical: path.join('src', 'server', 'routes') }
  ];

  for (const p of pathsToCheck) {
    const aExists = fs.existsSync(p.a) && fs.statSync(p.a).isDirectory();
    const bExists = fs.existsSync(p.b) && fs.statSync(p.b).isDirectory();

    if (aExists && bExists) {
      issues.push(`Detected duplicate directories: "${path.relative(rootDir, p.a)}" and "${path.relative(rootDir, p.b)}". Use canonical location "${p.canonical}".`);
    }
  }

  return issues;
}

module.exports = {
  findDuplicateServerPaths
};
