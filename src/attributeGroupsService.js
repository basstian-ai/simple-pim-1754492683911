// In-memory dataset representing attribute groups.
// Fields: id, code, label, type, required
const ATTRIBUTE_GROUPS = [
  { id: '1', code: 'color', label: 'Color', type: 'option', required: true },
  { id: '2', code: 'size', label: 'Size', type: 'option', required: true },
  { id: '3', code: 'material', label: 'Material', type: 'text', required: false },
  { id: '4', code: 'brand', label: 'Brand', type: 'text', required: false },
  { id: '5', code: 'weight', label: 'Weight', type: 'number', required: false },
  { id: '6', code: 'length', label: 'Length', type: 'number', required: false },
  { id: '7', code: 'country_of_origin', label: 'Country of origin', type: 'text', required: false },
  { id: '8', code: 'gender', label: 'Gender', type: 'option', required: false }
];

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return fallback;
  return n;
}

function applyFilters(items, filters) {
  return items.filter((it) => {
    if (filters.code) {
      if (it.code !== filters.code) return false;
    }
    if (filters.type) {
      if (it.type !== filters.type) return false;
    }
    if (typeof filters.required === 'boolean') {
      if (it.required !== filters.required) return false;
    }
    if (filters.label) {
      const needle = String(filters.label).toLowerCase();
      if (!String(it.label).toLowerCase().includes(needle)) return false;
    }
    if (filters.q) {
      const needle = String(filters.q).toLowerCase();
      // search code and label
      if (!it.code.toLowerCase().includes(needle) && !it.label.toLowerCase().includes(needle)) return false;
    }
    return true;
  });
}

/**
 * Search attribute groups with filters and server-side pagination.
 * Accepts: { q, code, label, type, required, page, perPage }
 * Returns: { results, total, page, perPage }
 */
function searchAttributeGroups(options = {}) {
  const page = parsePositiveInt(options.page, 1);
  const perPage = parsePositiveInt(options.perPage, 10);
  if (perPage > 100) throw new Error('perPage must be <= 100');

  const filters = {};
  if (options.q) filters.q = String(options.q);
  if (options.code) filters.code = String(options.code);
  if (options.label) filters.label = String(options.label);
  if (options.type) filters.type = String(options.type);
  if (options.required !== undefined) {
    // accept true/false boolean or string 'true'/'false'
    if (typeof options.required === 'string') {
      if (options.required.toLowerCase() === 'true') filters.required = true;
      else if (options.required.toLowerCase() === 'false') filters.required = false;
    } else if (typeof options.required === 'boolean') {
      filters.required = options.required;
    }
  }

  const filtered = applyFilters(ATTRIBUTE_GROUPS, filters);
  const total = filtered.length;
  const offset = (page - 1) * perPage;
  const results = filtered.slice(offset, offset + perPage);

  return {
    results,
    total,
    page,
    perPage
  };
}

module.exports = {
  searchAttributeGroups,
  // exported for tests
  __test__: {
    ATTRIBUTE_GROUPS
  }
};
