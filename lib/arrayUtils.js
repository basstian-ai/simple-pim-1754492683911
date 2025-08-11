function uniqueConcat(arr1, arr2) {
  // Ensure inputs are arrays
  const a = Array.isArray(arr1) ? arr1 : [];
  const b = Array.isArray(arr2) ? arr2 : [];

  // Use a Set to deduplicate while preserving first occurrence order from arr1 then arr2
  const seen = new Set();
  const result = [];

  for (const item of a) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  for (const item of b) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}

module.exports = { uniqueConcat };
