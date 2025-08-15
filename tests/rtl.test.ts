import { isRTLLocale, dirFromLocale } from '../src/i18n/rtl';

describe('RTL locale utilities', () => {
  test('detects common RTL languages', () => {
    expect(isRTLLocale('ar')).toBe(true);
    expect(isRTLLocale('ar-SA')).toBe(true);
    expect(isRTLLocale('he-IL')).toBe(true);
    expect(isRTLLocale('fa')).toBe(true);
  });

  test('returns false for LTR languages', () => {
    expect(isRTLLocale('en')).toBe(false);
    expect(isRTLLocale('en-US')).toBe(false);
    expect(isRTLLocale('fr')).toBe(false);
  });

  test('dirFromLocale returns proper direction', () => {
    expect(dirFromLocale('ar')).toBe('rtl');
    expect(dirFromLocale('he-IL')).toBe('rtl');
    expect(dirFromLocale('en-US')).toBe('ltr');
    expect(dirFromLocale('')).toBe('ltr');
    expect(dirFromLocale(undefined)).toBe('ltr');
  });
});
