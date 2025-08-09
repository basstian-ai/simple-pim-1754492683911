export function slugifyAttribute(value) {
  if (value == null) return '';
  return String(value)
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

export default function suggestAttributes(input) {
  if (!input) return [];
  const tokens = String(input)
    .split(/[\s,;/|]+/)
    .map((t) => slugifyAttribute(t))
    .filter(Boolean);
  return Array.from(new Set(tokens));
}
