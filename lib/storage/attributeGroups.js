const fs = require('fs');
const path = require('path');

function getFilePath() {
  const p = process.env.ATTR_GROUPS_FILE
    ? path.resolve(process.env.ATTR_GROUPS_FILE)
    : path.join(process.cwd(), 'data', 'attribute-groups.json');
  ensureFile(p);
  return p;
}

function ensureFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]\n', 'utf8');
  }
}

function readGroups() {
  const file = getFilePath();
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function writeGroups(groups) {
  const file = getFilePath();
  fs.writeFileSync(file, JSON.stringify(groups, null, 2) + '\n', 'utf8');
}

function generateId() {
  // Simple unique-ish id: timestamp + random string
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 8)
  );
}

function addGroup({ name, description }) {
  const groups = readGroups();
  const now = new Date().toISOString();
  const group = {
    id: generateId(),
    name: String(name || '').trim(),
    description: String(description || '').trim(),
    createdAt: now,
    updatedAt: now,
  };
  groups.push(group);
  writeGroups(groups);
  return group;
}

function findByName(name) {
  const groups = readGroups();
  const n = String(name || '').trim().toLowerCase();
  return groups.find((g) => g.name.toLowerCase() === n);
}

module.exports = {
  getFilePath,
  readGroups,
  writeGroups,
  addGroup,
  findByName,
};
