import { useEffect } from 'react';
import { dirFromLocale } from '../i18n/rtl';

/**
 * Hook: ensure the given locale's text direction is applied.
 * - If `root` is provided it will be used as the element to set `dir` on,
 *   otherwise document.documentElement is used.
 * - On unmount the previous `dir` attribute is restored/removed.
 *
 * Usage:
 *   useDirection('ar-SA');
 */
export default function useDirection(locale?: string | null, root?: HTMLElement | null) {
  const lang = locale ?? (typeof navigator !== 'undefined' ? (navigator.language || navigator['lang']) : undefined);
  const dir = dirFromLocale(lang ?? undefined);

  useEffect(() => {
    const target = root ?? (typeof document !== 'undefined' ? document.documentElement : null);
    if (!target) return;

    const prev = target.getAttribute('dir');
    target.setAttribute('dir', dir);
    // also expose a data-locale hook for easier CSS/scoping/debugging
    if (lang) target.setAttribute('data-locale', String(lang));

    return () => {
      if (prev !== null) {
        target.setAttribute('dir', prev);
      } else {
        target.removeAttribute('dir');
      }
      target.removeAttribute('data-locale');
    };
    // intentionally include root and lang so updates to either re-run effect
  }, [dir, lang, root]);

  return dir;
}
