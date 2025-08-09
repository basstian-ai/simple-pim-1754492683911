let groups = [];

function nowIso() {
  return new Date().toISOString();
}

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  ).toLowerCase();
}

function validatePayload({ code, name }) {
  const errors = {};
  if (!code || typeof code !== 'string' || !code.trim()) {
    errors.code = 'Code is required';
  } else if (!/^[a-z0-9_-]+$/i.test(code)) {
    errors.code = 'Code must contain only letters, numbers, dashes or underscores';
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function codeExists(code, excludeId) {
  return groups.some(
    (g) => g.code.toLowerCase() === code.toLowerCase() && g.id !== excludeId
  );
}

export function listAttributeGroups() {
  return groups
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAttributeGroup(id) {
  return groups.find((g) => g.id === id) || null;
}

export function createAttributeGroup({ code, name, description = '' }) {
  const { valid, errors } = validatePayload({ code, name });
  if (!valid) {
    return { ok: false, status: 400, errors };
  }
  if (codeExists(code)) {
    return {
      ok: false,
      status: 409,
      errors: { code: 'Code must be unique' },
    };
  }
  const now = nowIso();
  const item = {
    id: generateId(),
    code: code.trim(),
    name: name.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    createdAt: now,
    updatedAt: now,
  };
  groups.push(item);
  return { ok: true, status: 201, item };
}

export function updateAttributeGroup(id, patch) {
  const item = getAttributeGroup(id);
  if (!item) return { ok: false, status: 404 };

  const next = { ...item };

  if (patch.code !== undefined) {
    if (!patch.code || !/^[a-z0-9_-]+$/i.test(patch.code)) {
      return {
        ok: false,
        status: 400,
        errors: { code: 'Code must contain only letters, numbers, dashes or underscores' },
      };
    }
    if (codeExists(patch.code, id)) {
      return { ok: false, status: 409, errors: { code: 'Code must be unique' } };
    }
    next.code = String(patch.code).trim();
  }

  if (patch.name !== undefined) {
    if (!patch.name || !String(patch.name).trim()) {
      return { ok: false, status: 400, errors: { name: 'Name is required' } };
    }
    next.name = String(patch.name).trim();
  }

  if (patch.description !== undefined) {
    next.description = String(patch.description || '').trim();
  }

  next.updatedAt = nowIso();

  const idx = groups.findIndex((g) => g.id === id);
  groups[idx] = next;
  return { ok: true, status: 200, item: next };
}

export function deleteAttributeGroup(id) {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return { ok: false, status: 404 };
  const [removed] = groups.splice(idx, 1);
  return { ok: true, status: 200, item: removed };
}

// Test-only utility to get a clean state
export function __resetAttributeGroupsForTests() {
  groups = [];
}
