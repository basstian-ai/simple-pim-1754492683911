'use strict';

const { UniqueConstraintError } = require('./errors');

// ProductService provides create/update helpers that ensure SKU and slug uniqueness.
// It supports friendly errors and optional auto-suffixing to resolve collisions.

// options:
// - autoSuffix (boolean): auto-suffix slug when collision occurs (defaults false)
// - autoSuffixSku (boolean): auto-suffix sku when collision occurs (defaults false)
// - maxAttempts (number): how many suffix attempts before giving up
// - suffixSeparator (string): '-' by default

class ProductService {
  constructor(store, { suffixSeparator = '-' } = {}) {
    this.store = store;
    this.suffixSeparator = suffixSeparator;
    // simple in-memory mutex map to serialize retries for same baseIdentifier key in the service layer
    this._locks = new Map();
  }

  // Very small per-key lock to reduce thundering retries in process. Not a DB lock substitute.
  async _withKeyLock(key, fn) {
    const prev = this._locks.get(key) || Promise.resolve();
    let release;
    const p = new Promise((resolve) => (release = resolve));
    this._locks.set(key, prev.then(() => p));
    try {
      await prev;
      return await fn();
    } finally {
      release();
      // clear only if the current entry points to our p (avoid races)
      if (this._locks.get(key) === p) this._locks.delete(key);
    }
  }

  _makeSuggestion(field, base, attempt) {
    if (attempt === 0) return { field, suggestion: base };
    return { field, suggestion: `${base}${this.suffixSeparator}${attempt}` };
  }

  async createProduct(data, options = {}) {
    const {
      autoSuffix = false,
      autoSuffixSku = false,
      maxAttempts = 20,
      lockKey = data.slug || data.sku || 'global',
    } = options;

    // Keep retries serialized per lockKey to reduce duplicate retries inside same process
    return this._withKeyLock(lockKey, async () => {
      let attempt = 0;
      const baseSlug = data.slug;
      const baseSku = data.sku;

      while (attempt < maxAttempts) {
        const candidate = Object.assign({}, data);
        if (attempt > 0) {
          if (baseSlug && (autoSuffix || autoSuffixSku === false)) {
            // default: auto-suffix slug when allowed
            candidate.slug = `${baseSlug}${this.suffixSeparator}${attempt}`;
          }
          if (baseSku && autoSuffixSku) {
            candidate.sku = `${baseSku}${this.suffixSeparator}${attempt}`;
          }
        }

        try {
          const saved = await this.store.insert(candidate);
          return saved;
        } catch (err) {
          if (!(err instanceof UniqueConstraintError)) throw err;

          // If no auto-suffixing allowed, surface friendly error with suggestions on first collision
          const suggestions = [];
          if (err.fields.includes('slug') && baseSlug) {
            suggestions.push(this._makeSuggestion('slug', baseSlug, 1));
          }
          if (err.fields.includes('sku') && baseSku && autoSuffixSku) {
            suggestions.push(this._makeSuggestion('sku', baseSku, 1));
          }

          if (!autoSuffix && !autoSuffixSku) {
            throw new UniqueConstraintError('SKU/slug conflict', { fields: err.fields, suggestions });
          }

          attempt += 1;
          // continue retrying with incremented attempt
        }
      }

      throw new Error('Exceeded max attempts while trying to create a unique sku/slug');
    });
  }

  async updateProduct(id, patch, options = {}) {
    // When updating, if sku or slug is changing, we need to handle collisions similarly.
    const {
      autoSuffix = false,
      autoSuffixSku = false,
      maxAttempts = 20,
      lockKey = patch.slug || patch.sku || `update-${id}`,
    } = options;

    return this._withKeyLock(lockKey, async () => {
      let attempt = 0;
      const baseSlug = patch.slug;
      const baseSku = patch.sku;

      while (attempt < maxAttempts) {
        const candidatePatch = Object.assign({}, patch);
        if (attempt > 0) {
          if (baseSlug && autoSuffix) candidatePatch.slug = `${baseSlug}${this.suffixSeparator}${attempt}`;
          if (baseSku && autoSuffixSku) candidatePatch.sku = `${baseSku}${this.suffixSeparator}${attempt}`;
        }

        try {
          const updated = await this.store.update(id, candidatePatch);
          return updated;
        } catch (err) {
          if (!(err instanceof UniqueConstraintError)) throw err;

          if (!autoSuffix && !autoSuffixSku) {
            const suggestions = [];
            if (err.fields.includes('slug') && baseSlug) suggestions.push(this._makeSuggestion('slug', baseSlug, 1));
            if (err.fields.includes('sku') && baseSku && autoSuffixSku) suggestions.push(this._makeSuggestion('sku', baseSku, 1));
            throw new UniqueConstraintError('SKU/slug conflict on update', { fields: err.fields, suggestions });
          }

          attempt += 1;
        }
      }

      throw new Error('Exceeded max attempts while trying to update a unique sku/slug');
    });
  }
}

module.exports = {
  ProductService,
};
