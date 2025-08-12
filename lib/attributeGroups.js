/**
 * Attribute groups facade
 *
 * This module provides a small compatibility surface used by API routes.
 * Historically there are multiple implementations / stores in the codebase.
 * The API handlers expect functions such as getGroup, updateGroup, deleteGroup
 * and a validator. To avoid duplication we delegate persistence operations
 * to lib/attributeGroupsStore.js and validation to lib/attributeGroupsCore.js.
 *
 * Exports:
 *  - loadAttributeGroups(): read groups array (for listing)
 *  - getGroup(id): return group or null
 *  - updateGroup(id, patch): update and return updated group (throws on not found)
 *  - deleteGroup(id): remove group (throws on not found)
 *  - validateGroupPayload(payload): return { valid, errors }
 *  - DATA_PATH: path to backing file (kept for compatibility)
 */

const fs = require('fs');
const path = require('path');

const store = require('./attributeGroupsStore');
const { validateGroup } = require('./attributeGroupsCore');

const DATA_PATH = path.join(process.cwd(), 'data', 'attribute-groups.json');

function loadAttributeGroups() {
  // Prefer to read from the store which centralizes file access. Fallback to
  // reading the data file directly for environments that expect that.
  try {
    const groups = store.listGroups();
    if (Array.isArray(groups)) return groups;
  } catch (_) {
    // ignore and try disk
  }

  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(raw);
    // normalize to array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.groups)) return data.groups;
  } catch (_) {
    // ignore
  }
  return [];
}

function getGroup(id) {
  if (!id) return null;
  try {
    const g = store.getGroup(id);
    return g || null;
  } catch (e) {
    return null;
  }
}

function updateGroup(id, patch) {
  if (!id) {
    const err = new Error('id is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  try {
    const updated = store.updateGroup(id, patch);
    if (!updated) {
      const err = new Error('Not Found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    return updated;
  } catch (e) {
    // Re-throw known errors, wrap others
    if (e && e.code) throw e;
    const err = new Error('Failed to update group');
    err.code = 'UPDATE_ERROR';
    throw err;
  }
}

function deleteGroup(id) {
  if (!id) {
    const err = new Error('id is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  try {
    const ok = store.deleteGroup(id);
    if (!ok) {
      const err = new Error('Not Found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    return true;
  } catch (e) {
    if (e && e.code) throw e;
    const err = new Error('Failed to delete group');
    err.code = 'DELETE_ERROR';
    throw err;
  }
}

function validateGroupPayload(payload) {
  // Use the core validator which expects a single group object.
  try {
    const res = validateGroup(payload);
    // validateGroup returns { valid, errors } where errors is array of messages
    return { valid: Boolean(res && res.valid), errors: res.errors || [] };
  } catch (e) {
    return { valid: false, errors: [e && e.message ? e.message : 'Validation failed'] };
  }
}

module.exports = {
  loadAttributeGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  validateGroupPayload,
  DATA_PATH,
};

