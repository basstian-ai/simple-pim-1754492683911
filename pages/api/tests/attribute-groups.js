const store = require('../../../lib/attributeGroupsStore');

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default function handler(req, res) {
  try {
    const steps = [];

    // Snapshot initial
    const initial = store.list();
    const initialCount = initial.length;
    steps.push({ name: 'initial_count', ok: typeof initialCount === 'number', details: { initialCount } });

    // Create
    const created = store.create({ name: 'Test Group', attributes: [{ code: 'test', label: 'Test', type: 'text' }] });
    const afterCreateCount = store.list().length;
    steps.push({ name: 'create_group', ok: !!created && afterCreateCount === initialCount + 1, details: { id: created.id, afterCreateCount } });

    // Update name
    const renamed = store.update(created.id, { name: 'Renamed Group' });
    steps.push({ name: 'rename_group', ok: !!renamed && renamed.name === 'Renamed Group' });

    // Add attribute
    const withAttr = store.update(created.id, { attributes: [...(renamed.attributes || []), { code: 'color', label: 'Color', type: 'text' }] });
    const hasColor = (withAttr.attributes || []).some((a) => a.code === 'color');
    steps.push({ name: 'add_attribute', ok: !!withAttr && hasColor, details: { attrCount: withAttr.attributes.length } });

    // Delete
    const removed = store.remove(created.id);
    const finalCount = store.list().length;
    steps.push({ name: 'delete_group', ok: removed && finalCount === initialCount, details: { finalCount } });

    const ok = steps.every((s) => s.ok);
    return json(res, ok ? 200 : 500, { ok, steps });
  } catch (e) {
    console.error('test attribute-groups failed', e);
    return json(res, 500, { ok: false, error: 'Exception', message: String(e && e.message || e) });
  }
}
