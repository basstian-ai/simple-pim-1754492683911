import { useEffect, useState } from 'react';
import {
  slugify,
  upsertGroup,
  validateGroup,
  normalizeGroup,
} from '../../utils/attribute-groups';

function runTests() {
  const results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (e) {
      results.push({ name, pass: false, error: e && e.message ? e.message : String(e) });
    }
  }

  function assert(cond, message) {
    if (!cond) throw new Error(message || 'Assertion failed');
  }

  test('slugify basic', () => {
    assert(slugify('Color & Size') === 'color-size', 'Should slugify special chars');
    assert(slugify('  "Brand" ') === 'brand', 'Should strip quotes and trim');
  });

  test('validateGroup detects duplicate attribute codes and labels', () => {
    const g = normalizeGroup({
      name: 'Apparel',
      attributes: [
        { code: 'color', label: 'Color', type: 'select', options: ['Red'] },
        { code: 'color', label: 'Color', type: 'select', options: ['Blue'] },
      ],
    });
    const v = validateGroup(g);
    assert(v.ok === false, 'Validation should fail');
    assert(v.errors.some((e) => e.toLowerCase().includes('duplicate attribute code')), 'Should report duplicate code');
    assert(v.errors.some((e) => e.toLowerCase().includes('duplicate attribute label')), 'Should report duplicate label');
  });

  test('upsertGroup inserts and updates preserving createdAt', () => {
    const g1 = normalizeGroup({ name: 'Electronics', attributes: [{ code: 'brand', label: 'Brand' }] });
    let arr = upsertGroup([], g1);
    assert(arr.length === 1, 'Should insert one');
    const createdAt = arr[0].createdAt;

    const edited = { ...arr[0], name: 'Electronics & Gadgets' };
    arr = upsertGroup(arr, edited);
    assert(arr.length === 1, 'Still one after update');
    assert(arr[0].name === 'Electronics & Gadgets', 'Name updated');
    assert(arr[0].createdAt === createdAt, 'createdAt preserved');
  });

  return results;
}

export default function AttributeGroupsTestsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(runTests());
  }, []);

  const passCount = results.filter((r) => r.pass).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1>Attribute Groups Tests</h1>
      <p>Lightweight client-side tests for attribute group utilities.</p>
      <div style={{ marginBottom: 12 }}>
        <strong>Summary:</strong> {passCount}/{results.length} passed
      </div>
      <ul>
        {results.map((r, i) => (
          <li key={i} style={{ color: r.pass ? 'green' : 'red' }}>
            {r.pass ? '✓' : '✗'} {r.name}
            {!r.pass && r.error ? (
              <div style={{ color: '#900', fontSize: 13, marginTop: 4 }}>{r.error}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
