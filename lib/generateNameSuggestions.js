function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  const tokens = text.toLowerCase().match(/[a-z0-9]+/gi) || [];
  return tokens;
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","for","with","of","in","on","to","by","from","at","as","is","are","it","this","that","these","those","be","made","make","using","use","you","your","our","their","his","her","its","into","over","under","up","down","out","about","but","not","just","more","most","very","can","will","may","might","should","could","would","than","then","there","here","have","has","had","was","were","am","i","we","they","he","she","them","us","me","my","mine","ours"
]);

function pickKeywords(description, limit = 6) {
  const tokens = tokenize(description).filter((t) => !STOP_WORDS.has(t) && t.length >= 3);
  if (tokens.length === 0) return [];
  const freq = new Map();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) || 0) + 1);
  }
  const sorted = Array.from(freq.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].length - a[0].length;
    })
    .map(([t]) => t);
  return sorted.slice(0, limit).map(titleCase);
}

function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = item.trim();
    if (!key) continue;
    if (!seen.has(key.toLowerCase())) {
      seen.add(key.toLowerCase());
      out.push(key);
    }
  }
  return out;
}

function generateNameSuggestions(description, opts = {}) {
  const max = Math.max(3, Math.min(10, opts.max || 7));
  const keywords = pickKeywords(description, 6);

  if (keywords.length === 0) {
    return unique([
      "New Product",
      "Premium Product",
      "Essential Product",
      "Classic Collection",
    ]).slice(0, max);
  }

  const [k1, k2, k3] = keywords;
  const combos = [];

  // Core patterns
  combos.push(`${k1} ${k2 || "Product"}`.trim());
  combos.push(`Premium ${k1}`);
  combos.push(`${k1} ${k2 ? k2 + " " : ""}Pro`.trim());
  combos.push(`${k1} ${k2 ? k2 + " " : ""}Classic`.trim());
  combos.push(`${k1} ${k2 ? k2 + " " : ""}Essentials`.trim());
  combos.push(`${k1} ${k2 ? k2 + " " : ""}Plus`.trim());
  combos.push(`${k1} Collection`);

  // Optional extra variety if we have more keywords
  if (k3) combos.push(`${k1} ${k3}`);

  return unique(combos).slice(0, max);
}

module.exports = { generateNameSuggestions };
