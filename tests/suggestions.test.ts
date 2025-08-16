import { generateSuggestions } from '../src/services/suggestions';

// Basic tests using Jest semantics. Run with: npx jest tests/suggestions.test.ts

describe('generateSuggestions', () => {
  it('returns name, color and material hints for a blue cotton product (preview mode)', async () => {
    const text = 'Blue cotton shirt - Large';
    const suggestions = await generateSuggestions(text, { preview: true, telemetryOptIn: false });

    expect(Array.isArray(suggestions)).toBe(true);
    // should include color 'blue'
    const hasBlue = suggestions.some(s => s.attribute === 'color' && s.value === 'blue');
    expect(hasBlue).toBe(true);

    const hasMaterial = suggestions.some(s => s.attribute === 'material' && s.value === 'cotton');
    expect(hasMaterial).toBe(true);

    // Preview should annotate reasons
    expect(suggestions.every(s => typeof s.reason === 'string' && s.reason.includes('(preview)'))).toBe(true);
  });

  it('gracefully handles empty product text', async () => {
    const suggestions = await generateSuggestions('', {});
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].attribute).toBe('name');
  });
});
