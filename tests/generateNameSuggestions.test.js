const assert = require("assert");
const { generateNameSuggestions } = require("../lib/generateNameSuggestions");

// Basic smoke tests for the offline name suggestion utility
(function run() {
  const samples = [
    "Soft cotton t-shirt for men with classic crew neck and breathable fabric.",
    "Lightweight running shoes with breathable mesh and cushioned sole.",
    "",
  ];

  // Each sample should yield at least 3 non-empty suggestions
  for (const desc of samples) {
    const list = generateNameSuggestions(desc);
    assert(Array.isArray(list), "Suggestions should be an array");
    assert(list.length >= 3, "Should return at least 3 suggestions");
    list.forEach((s) => assert(typeof s === "string" && s.trim().length > 0, "Suggestion should be a non-empty string"));
  }

  // Deterministic check for keyword-driven suggestions
  const deterministic = generateNameSuggestions("breathable cotton crew neck t shirt");
  assert(deterministic.some((s) => /cotton/i.test(s)), "Should include keyword-based suggestion");

  console.log("OK - generateNameSuggestions basic tests passed");
})();
