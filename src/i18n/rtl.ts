/*
 * RTL locale utilities
 * - list of known RTL primary language codes
 * - helpers to detect direction from a BCP47-like locale string
 */

export const RTL_LANGS = new Set([
  // common RTL primary language subtags
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian/Farsi
  'ur', // Urdu
  'dv', // Divehi/Maldivian
  'ps', // Pashto
  'syr',
  'ug',
  'ku',
  'yi'
]);

/**
 * Return true when the provided locale (e.g. "ar", "ar-SA", "he-IL")
 * is an RTL locale. Function is tolerant of undefined/null/empty.
 */
export function isRTLLocale(locale?: string | null): boolean {
  if (!locale) return false;
  const primary = String(locale).split('-')[0].toLowerCase();
  return RTL_LANGS.has(primary);
}

/**
 * Return the text direction for a locale: 'rtl' or 'ltr'.
 * Defaults to 'ltr' for unknown/empty locale.
 */
export function dirFromLocale(locale?: string | null): 'ltr' | 'rtl' {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}
