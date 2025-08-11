const ALLOWED_ATTRIBUTE_TYPES = ['text', 'number', 'boolean', 'select', 'multiselect', 'date'];

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateAttribute(attr, idx, seenCodes) {
  const errors = [];
  if (!attr || typeof attr !== 'object') {
    errors.push({ path: `attributes[${idx}]`, message: 'Attribute must be an object' });
    return errors;
  }

  if (!isNonEmptyString(attr.code)) {
    errors.push({ path: `attributes[${idx}].code`, message: 'code is required and must be a non-empty string' });
  } else {
    const code = attr.code.trim();
    if (seenCodes.has(code)) {
      errors.push({ path: `attributes[${idx}].code`, message: `duplicate code within group: ${code}` });
    } else {
      seenCodes.add(code);
    }
  }

  if (attr.type != null) {
    if (typeof attr.type !== 'string') {
      errors.push({ path: `attributes[${idx}].type`, message: 'type must be a string' });
    } else if (!ALLOWED_ATTRIBUTE_TYPES.includes(attr.type)) {
      errors.push({ path: `attributes[${idx}].type`, message: `unsupported type '${attr.type}'. Allowed: ${ALLOWED_ATTRIBUTE_TYPES.join(', ')}` });
    }
  }

  if (attr.options != null) {
    if (!Array.isArray(attr.options)) {
      errors.push({ path: `attributes[${idx}].options`, message: 'options must be an array when provided' });
    }
  }

  return errors;
}

function validateGroup(group, index) {
  const errors = [];
  if (!group || typeof group !== 'object') {
    errors.push({ path: `groups[${index}]`, message: 'Group must be an object' });
    return errors;
  }

  if (!isNonEmptyString(group.name)) {
    errors.push({ path: `groups[${index}].name`, message: 'name is required and must be a non-empty string' });
  }

  if (group.description != null && typeof group.description !== 'string') {
    errors.push({ path: `groups[${index}].description`, message: 'description must be a string when provided' });
  }

  const attrs = Array.isArray(group.attributes) ? group.attributes : [];
  if (!Array.isArray(group.attributes)) {
    errors.push({ path: `groups[${index}].attributes`, message: 'attributes must be an array' });
  }

  const seenCodes = new Set();
  attrs.forEach((attr, i) => {
    const attrErrors = validateAttribute(attr, i, seenCodes);
    attrErrors.forEach((e) => errors.push({ path: `groups[${index}].${e.path}`, message: e.message }));
  });

  return errors;
}

function validateGroups(input) {
  const result = { valid: true, errors: [], count: 0 };
  const groups = Array.isArray(input) ? input : (input && Array.isArray(input.groups) ? input.groups : []);

  if (!Array.isArray(groups)) {
    result.valid = false;
    result.errors.push({ path: 'groups', message: 'groups must be an array' });
    return result;
  }

  result.count = groups.length;
  groups.forEach((g, i) => {
    const errs = validateGroup(g, i);
    result.errors.push(...errs);
  });

  if (result.errors.length > 0) {
    result.valid = false;
  }
  return result;
}

module.exports = {
  ALLOWED_ATTRIBUTE_TYPES,
  validateGroups,
};
