export function slugify(input) {
  if (input == null) return "";
  return input
    .toString()
    // normalize accents
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    // spaces/underscores to hyphen
    .replace(/[_\s]+/g, "-")
    // remove invalid chars
    .replace(/[^a-z0-9-]/g, "")
    // collapse dashes
    .replace(/-+/g, "-")
    // trim dashes
    .replace(/^-+|-+$/g, "");
}

// default export shim for consumers using default import
export default slugify;
