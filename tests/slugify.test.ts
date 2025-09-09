import { describe, it, expect } from 'vitest';
import { slugify } from '../src/lib/slugify';

describe('slugify', () => {
  it('converts text to kebab-case', () => {
    expect(slugify('Chicken Alfredo')).toBe('chicken-alfredo');
    expect(slugify('  Spicy & Sweet  ')).toBe('spicy-sweet');
    expect(slugify('Café au lait')).toBe('café-au-lait');
    expect(slugify('---Multiple---Separators---')).toBe('multiple-separators');
    expect(slugify('')).toBe('');
  });
});
