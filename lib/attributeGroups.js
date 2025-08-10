'use strict';

function toSlug(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/g, '')
    .replace(/-$/g, '');
}

function sanitizeGroup(input) {
  const code = toSlug(input && input.code);
  const name = (input && input.name ? String(input.name) : '').trim();
  const description = (input && input.description ? String(input.description) : '').trim();
  return { code, name, description };
}

function validateGroup(input) {
  const g = sanitizeGroup(input);
  const errors = {};

  if (!g.code) {
    errors.code = 'Code is required';
  } else if (!/^[a-z0-9_-]{2,32}$/.test(g.code)) {
    errors.code = 'Code must be 2-32 chars: lowercase letters, numbers, dash or underscore';
  }

  if (!g.name) {
    errors.name = 'Name is required';
  } else if (g.name.length > 64) {
    errors.name = 'Name must be at most 64 characters';
  }

  if (g.description && g.description.length > 200) {
    errors.description = 'Description must be at most 200 characters';
  }

  return { valid: Object.keys(errors).length === 0, errors, group: g };
}

function isCodeUnique(groups, code) {
  const c = toSlug(code);
  return !Array.isArray(groups) || groups.findIndex(g => (g && g.code) === c) === -1;
}

function addGroup(groups, input) {
  const { valid, errors, group } = validateGroup(input);
  if (!valid) return { ok: false, errors };
  if (!isCodeUnique(groups, group.code)) {
    return { ok: false, errors: { code: 'Code already exists' } };
  }
  const updated = Array.isArray(groups) ? groups.slice() : [];
  updated.push(group);
  return { ok: true, groups: updated, group };
}

module.exports = {
  toSlug,
  sanitizeGroup,
  validateGroup,
  isCodeUnique,
  addGroup
};
