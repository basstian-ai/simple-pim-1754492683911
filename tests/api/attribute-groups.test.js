import handlerIndex from '../../pages/api/attribute-groups/index';
import handlerById from '../../pages/api/attribute-groups/[id]';
import { __resetAttributeGroupsForTests } from '../../lib/attributeGroupsStore';

function createMockRes() {
  const res = {};
  res._status = 200;
  res._json = undefined;
  res.status = function (code) {
    this._status = code;
    return this;
  };
  res.json = function (data) {
    this._json = data;
    return this;
  };
  res.setHeader = function () { return this; };
  return res;
}

async function run() {
  __resetAttributeGroupsForTests();

  // Create
  {
    const req = { method: 'POST', body: { code: 'dimensions', name: 'Dimensions' } };
    const res = createMockRes();
    await handlerIndex(req, res);
    if (res._status !== 201) throw new Error('Expected 201 on create');
    if (!res._json || !res._json.item || res._json.item.code !== 'dimensions') {
      throw new Error('Invalid create payload');
    }
  }

  // List
  {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handlerIndex(req, res);
    if (res._status !== 200) throw new Error('Expected 200 on list');
    if (!Array.isArray(res._json.data) || res._json.data.length !== 1) {
      throw new Error('List should return one item');
    }
  }

  // Get by id
  let createdId = undefined;
  {
    const reqList = { method: 'GET' };
    const resList = createMockRes();
    await handlerIndex(reqList, resList);
    createdId = resList._json.data[0].id;

    const req = { method: 'GET', query: { id: createdId } };
    const res = createMockRes();
    await handlerById(req, res);
    if (res._status !== 200) throw new Error('Expected 200 on get by id');
    if (!res._json.item || res._json.item.id !== createdId) {
      throw new Error('Get by id returned wrong item');
    }
  }

  // Update
  {
    const req = { method: 'PUT', query: { id: createdId }, body: { name: 'Dims' } };
    const res = createMockRes();
    await handlerById(req, res);
    if (res._status !== 200) throw new Error('Expected 200 on update');
    if (res._json.item.name !== 'Dims') throw new Error('Update did not apply');
  }

  // Delete
  {
    const req = { method: 'DELETE', query: { id: createdId } };
    const res = createMockRes();
    await handlerById(req, res);
    if (res._status !== 200) throw new Error('Expected 200 on delete');
  }

  // Verify empty
  {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handlerIndex(req, res);
    if (!Array.isArray(res._json.data) || res._json.data.length !== 0) {
      throw new Error('Expected empty list after delete');
    }
  }

  // eslint-disable-next-line no-console
  console.log('attribute-groups API tests passed');
}

// Allow running directly with `node tests/api/attribute-groups.test.js`
if (require.main === module) {
  run().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}

export default run;
