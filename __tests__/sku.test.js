'use strict';

const { slugify, generateSku } = require('../lib/sku');

describe('SKU utilities', () => {
  test('slugify produces uppercase, hyphenated ASCII', () => {
    expect(slugify('Café Racer 2.0!')).toBe('CAFE-RACER-2-0');
    expect(slugify('  --- Hello__World ---  ')).toBe('HELLO-WORLD');
  });

  test('generateSku returns deterministic SKU with checksum', () => {
    const sku1 = generateSku('Test Product');
    const sku2 = generateSku('Test Product');
    const sku3 = generateSku('Different Name');
    expect(sku1).toMatch(/^TEST-PRODUCT-[A-Z0-9]{6}$/);
    expect(sku1).toBe(sku2);
    expect(sku3).toMatch(/^DIFFERENT-NAME-[A-Z0-9]{6}$/);
    expect(sku3).not.toBe(sku1);
  });

  test('generateSku supports optional prefix', () => {
    const sku = generateSku('Widget', { prefix: 'pim' });
    expect(sku).toMatch(/^PIM-WIDGET-[A-Z0-9]{6}$/);
  });
});