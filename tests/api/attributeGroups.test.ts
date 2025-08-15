import * as db from '../../src/lib/db';
import { createGroup, listGroups, getGroup, updateGroup, deleteGroup } from '../../src/api/attributeGroups';

beforeEach(() => {
  db.resetStore();
});

test('create -> list -> get -> update -> delete', async () => {
  const createRes = await createGroup({ name: 'Specs', attributes: ['color', 'size'] } as any);
  expect(createRes.ok).toBe(true);
  const created = createRes.group;
  expect(created.name).toBe('Specs');
  expect(created.attributes).toEqual(['color', 'size']);

  const all = await listGroups();
  expect(all.length).toBe(1);

  const got = await getGroup(created.id);
  expect(got).not.toBeNull();
  expect(got!.name).toBe('Specs');

  const upd = await updateGroup(created.id, { name: 'Updated Specs', attributes: ['material'] } as any);
  expect((upd as any).ok).toBe(true);
  expect((upd as any).group.name).toBe('Updated Specs');
  expect((upd as any).group.attributes).toEqual(['material']);

  const del = await deleteGroup(created.id);
  expect(del.ok).toBe(true);
  const after = await listGroups();
  expect(after.length).toBe(0);
});

test('validation prevents empty name', async () => {
  const res = await createGroup({ name: '', attributes: [] } as any);
  expect(res.ok).toBe(false);
  expect((res as any).errors).toHaveProperty('name');
});
