"use strict";

// Client-side storage key
var STORAGE_KEY = "attributeGroups";

function normalizeAttributeKey(name) {
  var s = String(name || "").trim().toLowerCase();
  // Replace non-alphanumeric with hyphens
  s = s.replace(/[^a-z0-9]+/g, "-");
  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, "");
  return s;
}

function uid() {
  return (
    "g_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5)
  );
}

function addGroup(groups, name) {
  var id = uid();
  var n = String(name || "").trim();
  return groups.concat([{ id: id, name: n || "Untitled", attributes: [] }]);
}

function removeGroup(groups, id) {
  return groups.filter(function (g) { return g.id !== id; });
}

function renameGroup(groups, id, name) {
  var n = String(name || "").trim();
  return groups.map(function (g) {
    return g.id === id ? Object.assign({}, g, { name: n }) : g;
  });
}

function addAttribute(groups, groupId, attrName) {
  var key = normalizeAttributeKey(attrName);
  if (!key) return groups;
  var display = String(attrName || "").trim() || key;
  return groups.map(function (g) {
    if (g.id !== groupId) return g;
    var exists = (g.attributes || []).some(function (a) { return a.key === key; });
    if (exists) return g;
    return Object.assign({}, g, {
      attributes: (g.attributes || []).concat([{ key: key, name: display }])
    });
  });
}

function removeAttribute(groups, groupId, key) {
  return groups.map(function (g) {
    if (g.id !== groupId) return g;
    return Object.assign({}, g, {
      attributes: (g.attributes || []).filter(function (a) { return a.key !== key; })
    });
  });
}

function loadGroups() {
  if (typeof window === "undefined") return [];
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function saveGroups(groups) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups || []));
  } catch (e) {
    // ignore
  }
}

module.exports = {
  normalizeAttributeKey: normalizeAttributeKey,
  addGroup: addGroup,
  removeGroup: removeGroup,
  renameGroup: renameGroup,
  addAttribute: addAttribute,
  removeAttribute: removeAttribute,
  loadGroups: loadGroups,
  saveGroups: saveGroups
};
