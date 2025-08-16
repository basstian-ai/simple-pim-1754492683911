export type TagPreview = {
  sku: string;
  currentTags: string[];
  addTags: string[]; // tags that would be added
  removeTags: string[]; // tags that would be removed
  resultingTags: string[]; // tags after the change
};

export interface ProductRepository {
  // Fetch tags for the given SKUs. Result map should contain an entry per sku (missing skus -> empty array)
  getTagsForSkus(skus: string[]): Promise<Record<string, string[]>>;

  // Apply tag changes for SKUs. Each change entry must include sku, addTags, removeTags.
  // Returns summary of applied count and per-sku errors, if any.
  applyTagChanges(
    changes: { sku: string; addTags: string[]; removeTags: string[] }[],
  ): Promise<{ applied: number; errors: Array<{ sku: string; error: string }> }>;
}

// Default repository that throws so code using the service explicitly wires a real repo.
export const UnsupportedProductRepository: ProductRepository = {
  getTagsForSkus(): Promise<Record<string, string[]>> {
    return Promise.reject(new Error('No ProductRepository wired.')); 
  },
  applyTagChanges(): Promise<{ applied: number; errors: Array<{ sku: string; error: string }> }> {
    return Promise.reject(new Error('No ProductRepository wired.'));
  },
};

export class ProductService {
  constructor(private repo: ProductRepository) {}

  // Compute preview given a list of skus and a single set of add/remove tags that apply to all skus
  async previewForSkus(
    skus: string[],
    addTags: string[] = [],
    removeTags: string[] = [],
  ): Promise<TagPreview[]> {
    if (!Array.isArray(skus) || skus.length === 0) return [];
    const map = await this.repo.getTagsForSkus(skus);

    return skus.map((sku) => {
      const current = Array.isArray(map[sku]) ? map[sku] : [];
      const toAdd = addTags.filter((t) => !current.includes(t));
      const toRemove = removeTags.filter((t) => current.includes(t));
      const resultingSet = new Set<string>(current);
      toAdd.forEach((t) => resultingSet.add(t));
      toRemove.forEach((t) => resultingSet.delete(t));
      return {
        sku,
        currentTags: current,
        addTags: toAdd,
        removeTags: toRemove,
        resultingTags: Array.from(resultingSet).sort(),
      } as TagPreview;
    });
  }

  // Compute preview when the caller supplies per-sku change objects
  async previewForChanges(
    changes: { sku: string; addTags?: string[]; removeTags?: string[] }[],
  ): Promise<TagPreview[]> {
    const skus = changes.map((c) => c.sku);
    const map = await this.repo.getTagsForSkus(skus);

    return changes.map((c) => {
      const sku = c.sku;
      const current = Array.isArray(map[sku]) ? map[sku] : [];
      const addTags = Array.isArray(c.addTags) ? c.addTags : [];
      const removeTags = Array.isArray(c.removeTags) ? c.removeTags : [];
      const toAdd = addTags.filter((t) => !current.includes(t));
      const toRemove = removeTags.filter((t) => current.includes(t));
      const resultingSet = new Set<string>(current);
      toAdd.forEach((t) => resultingSet.add(t));
      toRemove.forEach((t) => resultingSet.delete(t));
      return {
        sku,
        currentTags: current,
        addTags: toAdd,
        removeTags: toRemove,
        resultingTags: Array.from(resultingSet).sort(),
      } as TagPreview;
    });
  }

  // Apply tag changes in batch using repository. Repository should handle transactions.
  async applyChanges(
    changes: { sku: string; addTags?: string[]; removeTags?: string[] }[],
  ): Promise<{ applied: number; errors: Array<{ sku: string; error: string }> }> {
    const normalized = changes.map((c) => ({
      sku: c.sku,
      addTags: Array.isArray(c.addTags) ? c.addTags : [],
      removeTags: Array.isArray(c.removeTags) ? c.removeTags : [],
    }));
    return this.repo.applyTagChanges(normalized);
  }
}
