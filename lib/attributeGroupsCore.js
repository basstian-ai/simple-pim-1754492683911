const DEFAULT_ATTRIBUTE_TYPES = ["text", "number", "boolean"];

function generateId() {
  return (
    "ag_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)
  );
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeName(name) {
  return (name || "").trim();
}

function ensureGroupExists(state, groupId) {
  const idx = state.findIndex((g) => g.id === groupId);
  if (idx === -1) {
    throw new Error("Group not found: " + groupId);
  }
  return idx;
}

function createGroup(state, { name }) {
  const n = normalizeName(name);
  if (!n) throw new Error("Group name is required");
  const next = clone(state);
  next.push({ id: generateId(), name: n, attributes: [] });
  return next;
}

function updateGroup(state, groupId, updates) {
  const next = clone(state);
  const idx = ensureGroupExists(next, groupId);
  const g = next[idx];
  const u = { ...updates };
  if (u.name != null) {
    const n = normalizeName(u.name);
    if (!n) throw new Error("Group name is required");
    g.name = n;
  }
  return next;
}

function deleteGroup(state, groupId) {
  const next = clone(state);
  const idx = ensureGroupExists(next, groupId);
  next.splice(idx, 1);
  return next;
}

function _assertValidAttribute(attr) {
  if (!attr || typeof attr !== "object") throw new Error("Attribute object required");
  const code = (attr.code || "").trim();
  if (!code) throw new Error("Attribute code is required");
  const type = (attr.type || "text").trim();
  if (!DEFAULT_ATTRIBUTE_TYPES.includes(type)) {
    throw new Error("Invalid attribute type: " + type);
  }
}

function addAttribute(state, groupId, attr) {
  _assertValidAttribute(attr);
  const next = clone(state);
  const idx = ensureGroupExists(next, groupId);
  const g = next[idx];
  const code = attr.code.trim();
  if (g.attributes.some((a) => a.code === code)) {
    throw new Error("Attribute code must be unique within a group: " + code);
  }
  g.attributes.push({
    code,
    label: (attr.label || code).trim(),
    type: (attr.type || "text").trim(),
  });
  return next;
}

function updateAttribute(state, groupId, code, updates) {
  const next = clone(state);
  const idx = ensureGroupExists(next, groupId);
  const g = next[idx];
  const aIdx = g.attributes.findIndex((a) => a.code === code);
  if (aIdx === -1) throw new Error("Attribute not found: " + code);
  const a = g.attributes[aIdx];
  if (updates.code != null) {
    const newCode = (updates.code || "").trim();
    if (!newCode) throw new Error("Attribute code is required");
    if (newCode !== code && g.attributes.some((x) => x.code === newCode)) {
      throw new Error("Attribute code must be unique within a group: " + newCode);
    }
    a.code = newCode;
  }
  if (updates.label != null) {
    a.label = (updates.label || "").trim();
  }
  if (updates.type != null) {
    const t = (updates.type || "").trim();
    if (!DEFAULT_ATTRIBUTE_TYPES.includes(t)) {
      throw new Error("Invalid attribute type: " + t);
    }
    a.type = t;
  }
  return next;
}

function deleteAttribute(state, groupId, code) {
  const next = clone(state);
  const idx = ensureGroupExists(next, groupId);
  const g = next[idx];
  const aIdx = g.attributes.findIndex((a) => a.code === code);
  if (aIdx === -1) throw new Error("Attribute not found: " + code);
  g.attributes.splice(aIdx, 1);
  return next;
}

function validateGroup(group) {
  const errors = [];
  const name = normalizeName(group && group.name);
  if (!name) errors.push("Name is required");
  const seen = new Set();
  (group.attributes || []).forEach((a, i) => {
    const code = (a.code || "").trim();
    if (!code) errors.push(`Attribute #${i + 1}: code is required`);
    if (seen.has(code)) errors.push(`Attribute #${i + 1}: duplicate code '${code}'`);
    seen.add(code);
    const type = (a.type || "").trim();
    if (!DEFAULT_ATTRIBUTE_TYPES.includes(type)) {
      errors.push(`Attribute #${i + 1}: invalid type '${type}'`);
    }
  });
  return { valid: errors.length === 0, errors };
}

module.exports = {
  DEFAULT_ATTRIBUTE_TYPES,
  generateId,
  createGroup,
  updateGroup,
  deleteGroup,
  addAttribute,
  updateAttribute,
  deleteAttribute,
  validateGroup,
};
