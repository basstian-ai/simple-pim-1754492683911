export type AttributeGroup = {
  id: string;
  code: string;
  label: string;
  type?: string;
  required?: boolean;
};

export type SearchFilters = {
  code?: string; // substring match (case-insensitive)
  label?: string; // substring match (case-insensitive)
  type?: string; // exact match
  required?: boolean; // exact match
  page?: number; // 1-based
  perPage?: number;
};

// Lightweight in-memory sample dataset used by the search helper.
// In production this should be replaced with a DB-backed query implementation.
const SAMPLE_DATA: AttributeGroup[] = [
  { id: '1', code: 'color', label: 'Color', type: 'text', required: true },
  { id: '2', code: 'size', label: 'Size', type: 'text', required: false },
  { id: '3', code: 'material', label: 'Material', type: 'text', required: false },
  { id: '4', code: 'weight', label: 'Weight (kg)', type: 'number', required: false },
  { id: '5', code: 'in_stock', label: 'In stock', type: 'boolean', required: true },
  { id: '6', code: 'color_family', label: 'Color Family', type: 'text', required: false }
];

export type SearchResult = {
  items: AttributeGroup[];
  total: number;
  page: number;
  perPage: number;
};

/**
 * Server-side search implementation that performs filtering and pagination in-memory.
 * - code / label: case-insensitive substring
 * - type: exact match
 * - required: boolean exact match
 * Pagination defaults: page=1, perPage=25
 */
export async function searchAttributeGroups(filters: SearchFilters = {}): Promise<SearchResult> {
  const {
    code,
    label,
    type,
    required,
    page = 1,
    perPage = 25
  } = filters;

  if (page < 1 || perPage < 1) {
    throw new Error('Invalid pagination parameters');
  }

  // Start from authoritative store - for now SAMPLE_DATA
  let items = SAMPLE_DATA.slice();

  if (code && code.trim() !== '') {
    const q = code.toLowerCase();
    items = items.filter(a => a.code.toLowerCase().includes(q));
  }

  if (label && label.trim() !== '') {
    const q = label.toLowerCase();
    items = items.filter(a => a.label.toLowerCase().includes(q));
  }

  if (typeof type === 'string' && type.trim() !== '') {
    items = items.filter(a => (a.type ?? '') === type);
  }

  if (typeof required === 'boolean') {
    items = items.filter(a => Boolean(a.required) === required);
  }

  const total = items.length;
  const start = (page - 1) * perPage;
  const paged = items.slice(start, start + perPage);

  return {
    items: paged,
    total,
    page,
    perPage
  };
}
