const fs = require('fs');
const path = require('path');

function getDataFilePath() {
  const custom = process.env.ATTRIBUTE_GROUPS_PATH;
  if (custom) return path.resolve(custom);
  return path.join(process.cwd(), 'data', 'attribute-groups.json');
}

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadData() {
  const file = getDataFilePath();
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(raw);
    if (!json || typeof json !== 'object' || !Array.isArray(json.groups)) {
      return { groups: [] };
    }
    return json;
  } catch (e) {
    return { groups: [] };
  }
}

function saveData(data) {
  const file = getDataFilePath();
  ensureDirExists(file);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function genId() {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${Date.now().toString(36)}_${rnd}`;
}

function listGroups() {
  const data = loadData();
  return data.groups.slice();
}

function findByCode(code) {
  const data = loadData();
  return data.groups.find((g) => g.code === code) || null;
}

function createGroup({ name }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    const err = new Error('Name is required');
    err.statusCode = 400;
    throw err;
  }
  const data = loadData();
  let codeBase = slugify(name);
  if (!codeBase) codeBase = 'group';
  let code = codeBase;
  let i = 2;
  while (data.groups.some((g) => g.code === code)) {
    code = `${codeBase}-${i++}`;
  }
  const group = { id: genId(), name: name.trim(), code, attributes: [] };
  data.groups.push(group);
  saveData(data);
  return group;
}

function getGroup(id) {
  const data = loadData();
  return data.groups.find((g) => g.id === id) || null;
}

function updateGroup(id, patch) {
  const data = loadData();
  const idx = data.groups.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const current = data.groups[idx];
  const updated = { ...current };
  if (typeof patch.name === 'string' && patch.name.trim()) {
    updated.name = patch.name.trim();
    // keep code stable to avoid breaking references
  }
  if (Array.isArray(patch.attributes)) {
    // ensure attributes have minimal shape { code, label }
    const attrs = [];
    for (const a of patch.attributes) {
      if (!a) continue;
      const code = slugify(a.code || a.label || 'attr');
      const label = (a.label || a.code || '').toString().trim();
      if (!code || !label) continue;
      attrs.push({ code, label });
    }
    updated.attributes = attrs;
  }
  data.groups[idx] = updated;
  saveData(data);
  return updated;
}

function deleteGroup(id) {
  const data = loadData();
  const before = data.groups.length;
  data.groups = data.groups.filter((g) => g.id !== id);
  if (data.groups.length === before) return false;
  saveData(data);
  return true;
}

module.exports = {
  listGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  findByCode,
  getDataFilePath,
};
