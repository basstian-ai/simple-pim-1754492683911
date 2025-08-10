'use strict';

// Simple in-memory store seeded from repo data. In serverless, this persists per warm instance.
const seed = require('../data/attribute-groups.json');

const globalAny = global;
if (!globalAny.__ATTRIBUTE_GROUPS__) {
  const groups = Array.isArray(seed.groups) ? seed.groups.map((g) => ({ ...g })) : [];
  const maxId = groups.reduce((m, g) => Math.max(m, parseInt(g.id, 10) || 0), 0);
  globalAny.__ATTRIBUTE_GROUPS__ = {
    groups,
    nextId: String(maxId + 1),
  };
}

function nowISO() {
  return new Date().toISOString();
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function listGroups() {
  return clone(globalAny.__ATTRIBUTE_GROUPS__.groups);
}

function getGroup(id) {
  const g = globalAny.__ATTRIBUTE_GROUPS__.groups.find((x) => String(x.id) === String(id));
  return g ? clone(g) : null;
}

function validateAttribute(attr, index) {
  const errors = [];
  if (!attr || typeof attr !== 'object') {
    return [`attributes[${index}] must be an object`];
  }
  const { code, label, type, options } = attr;
  if (!code || typeof code !== 'string' || !/^[-a-zA-Z0-9_]{1,64}$/.test(code)) {
    errors.push(`attributes[${index}].code must match [-a-zA-Z0-9_]{1,64}`);
  }
  if (!label || typeof label !== 'string' || label.trim().length === 0 || label.length > 120) {
    errors.push(`attributes[${index}].label is required (1-120 chars)`);
  }
  const allowed = ['text', 'number', 'boolean', 'select'];
  if (!type || !allowed.includes(type)) {
    errors.push(`attributes[${index}].type must be one of ${allowed.join(', ')}`);
  }
  if (type === 'select') {
    if (!Array.isArray(options) || options.length === 0 || options.some((o) => typeof o !== 'string' || o.trim().length === 0)) {
      errors.push(`attributes[${index}].options must be a non-empty array of strings for type 'select'`);
    }
  }
  return errors;
}

function validateGroupPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['payload must be an object'] };
  }

  const value = {
    name: payload.name,
    attributes: Array.isArray(payload.attributes) ? payload.attributes : [],
  };

  if (!value.name || typeof value.name !== 'string' || value.name.trim().length === 0 || value.name.length > 100) {
    errors.push('name is required (1-100 chars)');
  }

  if (!Array.isArray(value.attributes)) {
    errors.push('attributes must be an array');
  } else {
    const attrCodes = new Set();
    value.attributes.forEach((attr, i) => {
      const errs = validateAttribute(attr, i);
      errs.forEach((e) => errors.push(e));
      if (attr && typeof attr.code === 'string') {
        const lc = attr.code.toLowerCase();
        if (attrCodes.has(lc)) {
          errors.push(`attributes[${i}].code duplicates an existing code`);
        }
        attrCodes.add(lc);
      }
    });
  }

  return { valid: errors.length === 0, errors, value };
}

function ensureUniqueName(name, excludeId) {
  const lc = name.trim().toLowerCase();
  const exists = globalAny.__ATTRIBUTE_GROUPS__.groups.some(
    (g) => g.name.trim().toLowerCase() === lc && String(g.id) !== String(excludeId)
  );
  if (exists) {
    const err = new Error('name must be unique');
    err.code = 'DUPLICATE_NAME';
    throw err;
  }
}

function createGroup(payload) {
  const { valid, errors, value } = validateGroupPayload(payload);
  if (!valid) {
    const err = new Error('Validation failed');
    err.code = 'VALIDATION_ERROR';
    err.details = errors;
    throw err;
  }
  ensureUniqueName(value.name);
  const id = globalAny.__ATTRIBUTE_GROUPS__.nextId;
  const timestamp = nowISO();
  const group = {
    id: String(id),
    name: value.name.trim(),
    attributes: clone(value.attributes),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  globalAny.__ATTRIBUTE_GROUPS__.groups.push(group);
  globalAny.__ATTRIBUTE_GROUPS__.nextId = String(parseInt(id, 10) + 1);
  return clone(group);
}

function updateGroup(id, payload) {
  const { valid, errors, value } = validateGroupPayload(payload);
  if (!valid) {
    const err = new Error('Validation failed');
    err.code = 'VALIDATION_ERROR';
    err.details = errors;
    throw err;
  }
  const idx = globalAny.__ATTRIBUTE_GROUPS__.groups.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) {
    const err = new Error('Not Found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  ensureUniqueName(value.name, id);
  const existing = globalAny.__ATTRIBUTE_GROUPS__.groups[idx];
  const updated = {
    ...existing,
    name: value.name.trim(),
    attributes: clone(value.attributes),
    updatedAt: nowISO(),
  };
  globalAny.__ATTRIBUTE_GROUPS__.groups[idx] = updated;
  return clone(updated);
}

function deleteGroup(id) {
  const idx = globalAny.__ATTRIBUTE_GROUPS__.groups.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) {
    const err = new Error('Not Found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  const removed = globalAny.__ATTRIBUTE_GROUPS__.groups.splice(idx, 1)[0];
  return clone(removed);
}

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  validateGroupPayload,
};
