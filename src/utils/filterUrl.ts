/*
 * Utilities for encoding/decoding Recent Failure Feed filters into a short, URL-safe string.
 * - Encodes JSON -> base64url (shorter than raw JSON in query string)
 * - Defensive: returns null when decoding fails
 * - Works in Node (Buffer) and browser (btoa) environments
 */

export type FailureFeedFilters = {
  // channel ids or names (e.g. ["web", "mobile"])
  channels?: string[];
  // environment (e.g. "prod", "staging")
  env?: string;
  // time window identifier (e.g. "24h", "7d")
  timeWindow?: string;
  // other arbitrary active filters (map of key -> values)
  activeFilters?: Record<string, string[] | string>;
};

const toBase64Url = (input: string): string => {
  // Use Buffer when available (Node), otherwise use browser btoa with safe UTF-8 handling
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(input, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // browser fallback
  const str = unescape(encodeURIComponent(input));
  return (typeof btoa === 'function'
    ? btoa(str)
    : /* istanbul ignore next */ window.btoa(str))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const fromBase64Url = (b64u: string): string | null => {
  try {
    const padded = b64u.padEnd(b64u.length + ((4 - (b64u.length % 4)) % 4), '=');
    const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');

    if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
      return Buffer.from(b64, 'base64').toString('utf8');
    }

    // browser
    const binary = (typeof atob === 'function' ? atob(b64) : window.atob(b64));
    // decode UTF-8
    return decodeURIComponent(escape(binary));
  } catch (err) {
    return null;
  }
};

export const encodeFiltersToParam = (filters: FailureFeedFilters): string => {
  // Keep encoding deterministic and compact: JSON stringify then base64url
  const json = JSON.stringify(filters || {});
  return toBase64Url(json);
};

export const decodeParamToFilters = (param: string | null | undefined): FailureFeedFilters | null => {
  if (!param) return null;
  try {
    const json = fromBase64Url(param);
    if (!json) return null;
    const parsed = JSON.parse(json);
    // Basic validation: parsed should be an object
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return null;
    return parsed as FailureFeedFilters;
  } catch (err) {
    return null;
  }
};

// Helper to read from location.search for key 'f'
export const readFiltersFromLocationSearch = (search: string): FailureFeedFilters | null => {
  try {
    const params = new URLSearchParams(search);
    const param = params.get('f');
    return decodeParamToFilters(param);
  } catch (err) {
    return null;
  }
};

// Helper to produce a short `?f=...` query string for a set of filters
export const buildFiltersQueryString = (filters: FailureFeedFilters): string => {
  const param = encodeFiltersToParam(filters);
  return `?f=${encodeURIComponent(param)}`;
};
