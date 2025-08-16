'use strict';

const { UniqueConstraintError } = require('./errors');

// Simple in-memory store that simulates a DB with a race window.
// insert/update will perform a check, wait (to simulate concurrency),
// then perform a final check before writing to simulate a DB unique constraint on write.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class InMemoryStore {
  constructor({ checkDelay = 20, writeDelay = 20 } = {}) {
    this._items = [];
    this._nextId = 1;
    this.checkDelay = checkDelay;
    this.writeDelay = writeDelay;
  }

  async insert(item) {
    // item must have sku and slug
    await sleep(this.checkDelay);

    const collidingFields = this._detectCollision(item);
    if (collidingFields.length) {
      throw new UniqueConstraintError('Unique constraint failed on insert', { fields: collidingFields });
    }

    await sleep(this.writeDelay);

    // final check to simulate DB enforcing uniqueness at write
    const collidingFieldsAfter = this._detectCollision(item);
    if (collidingFieldsAfter.length) {
      throw new UniqueConstraintError('Unique constraint failed on insert (final check)', { fields: collidingFieldsAfter });
    }

    const saved = Object.assign({}, item, { id: this._nextId++ });
    this._items.push(saved);
    return saved;
  }

  async update(id, patch) {
    await sleep(this.checkDelay);

    const existing = this._items.find((it) => it.id === id);
    if (!existing) throw new Error('NotFound');

    const candidate = Object.assign({}, existing, patch);

    const collidingFields = this._detectCollision(candidate, id);
    if (collidingFields.length) {
      throw new UniqueConstraintError('Unique constraint failed on update', { fields: collidingFields });
    }

    await sleep(this.writeDelay);

    const collidingFieldsAfter = this._detectCollision(candidate, id);
    if (collidingFieldsAfter.length) {
      throw new UniqueConstraintError('Unique constraint failed on update (final check)', { fields: collidingFieldsAfter });
    }

    Object.assign(existing, patch);
    return existing;
  }

  _detectCollision(candidate, ignoreId) {
    const collisions = [];
    if (candidate.sku != null) {
      const found = this._items.find((it) => it.sku === candidate.sku && it.id !== ignoreId);
      if (found) collisions.push('sku');
    }
    if (candidate.slug != null) {
      const found2 = this._items.find((it) => it.slug === candidate.slug && it.id !== ignoreId);
      if (found2) collisions.push('slug');
    }
    return collisions;
  }

  async findById(id) {
    return this._items.find((it) => it.id === id) || null;
  }

  async list() {
    return Array.from(this._items);
  }
}

module.exports = {
  InMemoryStore,
};
