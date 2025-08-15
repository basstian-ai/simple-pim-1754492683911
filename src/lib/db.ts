export type AttributeGroupEntity = {
  id: string;
  name: string;
  attributes: string[];
  createdAt: string;
  updatedAt: string;
};

let store: Record<string, AttributeGroupEntity> = {};

function nowIso() {
  return new Date().toISOString();
}

export function resetStore() {
  store = {};
}

export function getAllGroups(): AttributeGroupEntity[] {
  return Object.values(store).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getGroupById(id: string): AttributeGroupEntity | undefined {
  return store[id];
}

export function createGroup(data: { id?: string; name: string; attributes: string[] }): AttributeGroupEntity {
  const id = data.id ?? Math.random().toString(36).slice(2, 9);
  const now = nowIso();
  const entity: AttributeGroupEntity = {
    id,
    name: data.name,
    attributes: Array.isArray(data.attributes) ? data.attributes : [],
    createdAt: now,
    updatedAt: now,
  };
  store[id] = entity;
  return entity;
}

export function updateGroup(id: string, patch: { name?: string; attributes?: string[] }): AttributeGroupEntity | undefined {
  const existing = store[id];
  if (!existing) return undefined;
  const updated: AttributeGroupEntity = {
    ...existing,
    name: patch.name !== undefined ? patch.name : existing.name,
    attributes: patch.attributes !== undefined ? patch.attributes : existing.attributes,
    updatedAt: nowIso(),
  };
  store[id] = updated;
  return updated;
}

export function deleteGroup(id: string): boolean {
  if (!store[id]) return false;
  delete store[id];
  return true;
}

// For quick ad-hoc seed in dev
export function seedGroups(items: Array<{ id?: string; name: string; attributes: string[] }> = []) {
  resetStore();
  items.forEach((it) => createGroup(it));
}
