export type AttributeType = 'text' | 'number' | 'select' | 'boolean' | string;

export interface AttributeGroup {
  id: string;
  code: string;
  label: string;
  type: AttributeType;
  required: boolean;
  // Additional metadata fields may be present in real DB
}

export interface AttributeGroupFilters {
  code?: string; // substring match, case-insensitive
  label?: string; // substring match, case-insensitive
  type?: string; // exact match
  required?: boolean; // exact match
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// In-memory sample dataset. In production this file would delegate to a DB/query builder.
const ATTRIBUTE_GROUPS: AttributeGroup[] = [
  { id: '1', code: 'color', label: 'Color', type: 'select', required: true },
  { id: '2', code: 'size', label: 'Size', type: 'select', required: true },
  { id: '3', code: 'weight', label: 'Weight', type: 'number', required: false },
  { id: '4', code: 'material', label: 'Material', type: 'text', required: false },
  { id: '5', code: 'isEco', label: 'Is Eco Friendly', type: 'boolean', required: false },
  { id: '6', code: 'brand', label: 'Brand', type: 'text', required: true },
  { id: '7', code: 'origin', label: 'Country of Origin', type: 'text', required: false },
  { id: '8', code: 'length', label: 'Length', type: 'number', required: false },
  { id: '9', code: 'width', label: 'Width', type: 'number', required: false },
  { id: '10', code: 'height', label: 'Height', type: 'number', required: false },
  { id: '11', code: 'color_family', label: 'Color Family', type: 'select', required: false },
  { id: '12', code: 'gender', label: 'Gender', type: 'select', required: false }
];

function normalize(str?: string): string | undefined {
  return str ? str.trim().toLowerCase() : undefined;
}

/**
 * Search attribute groups with simple server-side filters and pagination.
 * - code and label are substring (case-insensitive)
 * - type is exact match
 * - required is exact boolean match
 */
export function searchAttributeGroups(
  filters: AttributeGroupFilters = {},
  page = 1,
  pageSize = 10
): PaginationResult<AttributeGroup> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Invalid page. Must be an integer >= 1.');
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error('Invalid pageSize. Must be an integer between 1 and 100.');
  }

  const code = normalize(filters.code);
  const label = normalize(filters.label);
  const type = normalize(filters.type);

  const filtered = ATTRIBUTE_GROUPS.filter((g) => {
    if (code && !g.code.toLowerCase().includes(code)) return false;
    if (label && !g.label.toLowerCase().includes(label)) return false;
    if (type && g.type.toLowerCase() !== type) return false;
    if (typeof filters.required === 'boolean' && g.required !== filters.required) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return {
    items,
    total,
    page: normalizedPage,
    pageSize,
    totalPages
  };
}
