"use strict";

// In-memory store for Attribute Groups
// This is ephemeral and resets on cold starts. Suitable for demos and tests.
let groups = [];

function nowISO() {
  return new Date().toISOString();
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function randomId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase();
}

function generateId(name) {
  const base = slugify(name) || "group";
  return `${base}-${randomId()}`;
}

function initDefaults() {
  groups = [
    {
      id: "basic-attributes-" + randomId(),
      name: "Basic Attributes",
      attributes: [
        { code: "title", label: "Title", type: "text" },
        { code: "description", label: "Description", type: "text" },
      ],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ];
}

// Ensure defaults on first load
if (groups.length === 0) initDefaults();

function listGroups() {
  return groups.slice();
}

function getGroup(id) {
  return groups.find((g) => g.id === id) || null;
}

function normalizeAttributes(attrs) {
  if (!Array.isArray(attrs)) return [];
  return attrs
    .map((a) => ({
      code: String(a && a.code ? a.code : "").trim(),
      label: String(a && a.label ? a.label : (a && a.code) || "").trim() || "Attribute",
      type: String(a && a.type ? a.type : "text").trim() || "text",
    }))
    .filter((a) => a.code.length > 0);
}

function createGroup(data) {
  const name = String(data && data.name ? data.name : "").trim();
  if (!name) {
    const err = new Error("name is required");
    err.statusCode = 400;
    throw err;
  }
  const attributes = normalizeAttributes((data && data.attributes) || []);
  const timestamp = nowISO();
  const group = {
    id: generateId(name),
    name,
    attributes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  groups.push(group);
  return group;
}

function updateGroup(id, data) {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) {
    const err = new Error("group not found");
    err.statusCode = 404;
    throw err;
  }
  const current = groups[idx];
  const next = { ...current };
  if (data && typeof data.name === "string") {
    const name = data.name.trim();
    if (!name) {
      const err = new Error("name cannot be empty");
      err.statusCode = 400;
      throw err;
    }
    next.name = name;
  }
  if (data && Object.prototype.hasOwnProperty.call(data, "attributes")) {
    next.attributes = normalizeAttributes(data.attributes);
  }
  next.updatedAt = nowISO();
  groups[idx] = next;
  return next;
}

function deleteGroup(id) {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  groups.splice(idx, 1);
  return true;
}

function resetForTests() {
  initDefaults();
}

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  __reset: resetForTests,
};
