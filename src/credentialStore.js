const { v4: uuidv4 } = require('uuid');

// Simple in-memory credential store that supports rotation and least-privilege roles.
// For production this would be backed by a secure store (KMS/HSM/Secrets manager) and audited.

class CredentialStore {
  constructor() {
    // apiKey -> { subject, roles: [], createdAt, active }
    this.keys = new Map();
    // subject -> set of apiKeys
    this.subjectIndex = new Map();
  }

  // create a key for a subject with roles; does NOT deactivate existing keys
  createForSubject(subject, roles = []) {
    const key = uuidv4();
    const entry = { subject, roles: Array.from(new Set(roles)), createdAt: Date.now(), active: true };
    this.keys.set(key, entry);
    if (!this.subjectIndex.has(subject)) this.subjectIndex.set(subject, new Set());
    this.subjectIndex.get(subject).add(key);
    return key;
  }

  // rotate: create a new key and deactivate previous keys for the subject (least-privilege/rotation)
  rotateSubject(subject, roles = []) {
    // deactivate existing keys for subject
    const keys = this.subjectIndex.get(subject) || new Set();
    for (const k of keys) {
      const e = this.keys.get(k);
      if (e) e.active = false;
    }
    // create and return new key
    const newKey = this.createForSubject(subject, roles);
    return newKey;
  }

  // revoke a key explicitly
  revokeKey(key) {
    const e = this.keys.get(key);
    if (e) e.active = false;
  }

  getEntry(key) {
    const e = this.keys.get(key);
    return e && e.active ? { ...e } : null;
  }

  getRoles(key) {
    const e = this.getEntry(key);
    return e ? Array.from(e.roles) : null;
  }

  reset() {
    this.keys.clear();
    this.subjectIndex.clear();
  }
}

// Export a singleton instance so app and tests can share the same store.
const store = new CredentialStore();
module.exports = store;
