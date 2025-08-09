import { generateSKU, parseKeyValueLines } from '../lib/sku';

describe('SKU utilities', () => {
  test('parseKeyValueLines parses simple lines', () => {
    const input = 'color=Red\n# comment\nsize= M\nmaterial=Cotton';
    expect(parseKeyValueLines(input)).toEqual({ color: 'Red', size: 'M', material: 'Cotton' });
  });

  test('generateSKU produces uppercase, deterministic shape with attributes', () => {
    const attrs = { size: 'M', color: 'Red' };
    const sku = generateSKU('Red Shirt', attrs);
    expect(sku).toMatch(/^REDSHI-[A-Z0-9-]+-[A-Z0-9]{4}$/);
    expect(sku).toContain('-CORE-SI'); // COlor + REd, SIze + M
  });

  test('generateSKU handles empty attributes', () => {
    const sku = generateSKU('Mug', {});
    expect(sku).toMatch(/^MUG-[A-Z0-9]{4}$/);
  });
});
