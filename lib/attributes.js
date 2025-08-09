const fs = require('fs');
const path = require('path');

function getDataPath() {
  return path.join(process.cwd(), 'data', 'attributes.json');
}

function loadAttributes() {
  const p = getDataPath();
  const jsonStr = fs.readFileSync(p, 'utf8');
  const data = JSON.parse(jsonStr);
  return data.attributes || [];
}

function groupByGroupName(attrs) {
  return (attrs || []).reduce((acc, a) => {
    const g = a.group || 'Ungrouped';
    if (!acc[g]) acc[g] = [];
    acc[g].push(a);
    return acc;
  }, {});
}

module.exports = { loadAttributes, groupByGroupName };
