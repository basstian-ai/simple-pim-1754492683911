export function slugify(input: string): string {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-\u00C0-\u024F]/g, '') // remove uncommon punctuation but keep letters (incl. accented)
    .replace(/[\s_-]+/g, '-') // collapse spaces/underscores to -
    .replace(/^-+|-+$/g, ''); // trim leading/trailing -
}
