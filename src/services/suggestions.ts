import { recordEvent } from '../lib/telemetry';

export type Suggestion = {
  group: string;
  attribute: string;
  value: string;
  score: number; // 0..1
  reason?: string;
};

export type SuggestOptions = {
  // If true, record lightweight telemetry events (opt-in by user)
  telemetryOptIn?: boolean;
  // Preview mode: UI asks for suggestions without any side-effects (same here, just annotated)
  preview?: boolean;
  // historical or contextual signals (optional)
  history?: Array<Record<string, any>>;
};

/**
 * generateSuggestions
 * - Small, deterministic stub implementation suitable for local testing and unit tests.
 * - Production integration should swap this to call a real AI model/service.
 */
export async function generateSuggestions(
  productText: string,
  options: SuggestOptions = {}
): Promise<Suggestion[]> {
  if (options.telemetryOptIn) {
    // best-effort telemetry
    try {
      recordEvent({ type: 'suggestions.request', preview: !!options.preview });
    } catch (err) {
      // swallow telemetry errors
    }
  }

  const normalized = (productText || '').toLowerCase();
  const tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);

  // Very small heuristic rules as a starting point
  const suggestions: Suggestion[] = [];

  // Name suggestion: first 3 tokens joined
  const name = tokens.slice(0, 3).join(' ');
  suggestions.push({
    group: 'Basic',
    attribute: 'name',
    value: name || 'Unnamed product',
    score: 0.9,
    reason: name ? 'extracted from product text' : 'fallback name'
  });

  // Color hint
  const colorCandidates: Record<string, string[]> = {
    blue: ['blue'],
    red: ['red'],
    black: ['black'],
    white: ['white'],
    green: ['green']
  };
  for (const k of Object.keys(colorCandidates)) {
    if (tokens.includes(k)) {
      suggestions.push({
        group: 'Appearance',
        attribute: 'color',
        value: k,
        score: 0.85,
        reason: `keyword match: ${k}`
      });
      break;
    }
  }

  // Material hints
  const materials = ['cotton', 'leather', 'polyester', 'silk', 'wool'];
  for (const m of materials) {
    if (tokens.includes(m)) {
      suggestions.push({
        group: 'Material',
        attribute: 'material',
        value: m,
        score: 0.8,
        reason: `keyword match: ${m}`
      });
      break;
    }
  }

  // Size hint (very naive)
  const sizeMap = { s: 'S', m: 'M', l: 'L', xl: 'XL', xxl: 'XXL' } as Record<string, string>;
  for (const s of Object.keys(sizeMap)) {
    if (tokens.includes(s)) {
      suggestions.push({
        group: 'Measurement',
        attribute: 'size',
        value: sizeMap[s],
        score: 0.75,
        reason: `token match: ${s}`
      });
      break;
    }
  }

  if (options.preview) {
    // annotate reasons to make it clear it's a preview
    for (const s of suggestions) {
      s.reason = (s.reason || '') + ' (preview)';
    }
  }

  if (options.telemetryOptIn) {
    try {
      recordEvent({ type: 'suggestions.response', count: suggestions.length });
    } catch (err) {
      // ignore telemetry failure
    }
  }

  // Sort by score desc
  suggestions.sort((a, b) => b.score - a.score);
  return suggestions;
}
