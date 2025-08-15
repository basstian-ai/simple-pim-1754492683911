import { AdapterMetadata, ImportAdapter, ExportAdapter } from './types';

type AnyAdapter = ImportAdapter | ExportAdapter;

function keyFor(meta: AdapterMetadata) {
  return `${meta.name}@${meta.adapterVersion}`;
}

export class AdapterRegistry {
  private adapters = new Map<string, AnyAdapter>();

  register(adapter: AnyAdapter & { meta: AdapterMetadata }) {
    const k = keyFor(adapter.meta);
    if (this.adapters.has(k)) {
      throw new Error(`Adapter already registered: ${k}`);
    }
    this.adapters.set(k, adapter);
  }

  /**
   * Resolve adapter by name and optional version. If version omitted, returns the adapter
   * with the highest adapterVersion (lexicographic) — small convenience for prototyping.
   */
  get(name: string, version?: string): (AnyAdapter & { meta: AdapterMetadata }) | undefined {
    if (version) {
      return this.adapters.get(`${name}@${version}`) as any;
    }
    // pick highest version that starts with name@
    const matches: { k: string; meta: AdapterMetadata }[] = [];
    for (const [k, a] of this.adapters.entries()) {
      if (k.startsWith(`${name}@`)) {
        // @ts-ignore - runtime meta exists
        matches.push({ k, meta: (a as any).meta });
      }
    }
    if (matches.length === 0) return undefined;
    matches.sort((a, b) => (a.meta.adapterVersion > b.meta.adapterVersion ? -1 : 1));
    return this.adapters.get(matches[0].k) as any;
  }

  list(): AdapterMetadata[] {
    const out: AdapterMetadata[] = [];
    for (const a of this.adapters.values()) {
      // @ts-ignore
      out.push((a as any).meta);
    }
    return out;
  }
}
