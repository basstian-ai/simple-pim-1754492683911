import * as db from '../lib/db';
import { validateAttributeGroup, AttributeGroup } from '../models/attributeGroup';

// Exported CRUD helpers for unit-testing and for wiring into any HTTP framework.
export async function listGroups(): Promise<AttributeGroup[]> {
  return db.getAllGroups();
}

export async function getGroup(id: string): Promise<AttributeGroup | null> {
  const g = db.getGroupById(id);
  return g ?? null;
}

export async function createGroup(payload: unknown): Promise<{ ok: true; group: AttributeGroup } | { ok: false; errors: any }> {
  const { valid, errors, value } = validateAttributeGroup(payload as any);
  if (!valid) return { ok: false, errors };
  const group = db.createGroup(value);
  return { ok: true, group };
}

export async function updateGroup(id: string, payload: unknown): Promise<{ ok: true; group: AttributeGroup } | { ok: false; status: 404 | 400; message: string; errors?: any }> {
  const existing = db.getGroupById(id);
  if (!existing) return { ok: false, status: 404, message: 'Not found' };
  const { valid, errors, value } = validateAttributeGroup(payload as any);
  if (!valid) return { ok: false, status: 400, message: 'Validation failed', errors };
  const updated = db.updateGroup(id, value as any)!;
  return { ok: true, group: updated };
}

export async function deleteGroup(id: string): Promise<{ ok: true } | { ok: false; status: 404; message: string }> {
  const removed = db.deleteGroup(id);
  if (!removed) return { ok: false, status: 404, message: 'Not found' };
  return { ok: true };
}

// Minimal Express-like handler (works in Next.js API routes if adapted)
export default async function handler(req: any, res: any) {
  try {
    const method = (req.method || 'GET').toUpperCase();
    if (method === 'GET') {
      const id = req.query?.id || req.query?.groupId;
      if (id) {
        const g = await getGroup(id);
        if (!g) return res.status(404).json({ error: 'Not found' });
        return res.json(g);
      }
      const all = await listGroups();
      return res.json(all);
    }

    if (method === 'POST') {
      const result = await createGroup(req.body);
      if (!result.ok) return res.status(400).json({ errors: result.errors });
      return res.status(201).json(result.group);
    }

    if (method === 'PUT') {
      const id = req.query?.id || req.query?.groupId || req.body?.id;
      if (!id) return res.status(400).json({ error: 'id required in query or body' });
      const result = await updateGroup(id, req.body);
      if (!result.ok) return res.status(result.status || 400).json({ error: result.message, errors: result.errors });
      return res.json(result.group);
    }

    if (method === 'DELETE') {
      const id = req.query?.id || req.query?.groupId;
      if (!id) return res.status(400).json({ error: 'id required' });
      const result = await deleteGroup(id);
      if (!result.ok) return res.status(404).json({ error: result.message });
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('attributeGroups.handler', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
