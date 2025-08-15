import assert from 'assert';
import { AdapterRegistry } from '../src/adapters/adapterRegistry';
import { csvAdapter } from '../src/adapters/csvAdapter';
import { jsonAdapter } from '../src/adapters/jsonAdapter';

async function run() {
  const registry = new AdapterRegistry();
  registry.register(csvAdapter);
  registry.register(jsonAdapter);

  // sanity: list
  const list = registry.list();
  assert(Array.isArray(list) && list.length >= 2, 'expected at least 2 adapters');

  // CSV import/export roundtrip
  const csv = 'id,title,description,locale,color\n1,Sample,"A product",en-US,red\n2,Another,,en-US,blue';
  const imported = await csvAdapter.import(csv);
  assert.strictEqual(imported.length, 2, 'csv import should produce 2 products');
  assert.strictEqual(imported[0].id, '1');
  assert.strictEqual(imported[0].attributes!['color'], 'red');

  const csvOut = await csvAdapter.export(imported);
  assert.ok(typeof csvOut === 'string' && csvOut.includes('id,title,description,locale'), 'csv export should contain header');

  // JSON import/export roundtrip
  const jsonIn = JSON.stringify(imported, null, 2);
  const jImported = await jsonAdapter.import(jsonIn);
  assert.strictEqual(jImported.length, 2);
  assert.strictEqual(jImported[1].id, '2');

  const jOut = await jsonAdapter.export(jImported);
  assert.ok(jOut.trim().startsWith('['), 'json export should produce array');

  // registry resolution by name
  const gotCsv = registry.get('csv');
  assert.ok(gotCsv, 'should resolve csv adapter');
  const gotJson = registry.get('json');
  assert.ok(gotJson, 'should resolve json adapter');

  console.log('OK');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
