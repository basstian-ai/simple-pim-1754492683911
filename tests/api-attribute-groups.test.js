import handler from '../pages/api/attribute-groups/index.js';

function createMockReqRes({ method = 'GET', url = '/api/attribute-groups', body = null } = {}) {
  const req = { method, url, body, headers: {}, query: {}, cookies: {} };
  let statusCode = 200;
  let headers = {};
  let jsonData = undefined;
  const res = {
    setHeader: (k, v) => { headers[k.toLowerCase()] = v; },
    status: (code) => { statusCode = code; return res; },
    json: (data) => { jsonData = data; return res; },
    end: (data) => { jsonData = data; return res; },
    get statusCode() { return statusCode; },
    get _headers() { return headers; },
    get _data() { return jsonData; },
  };
  return { req, res };
}

async function call(method = 'GET', body) {
  const { req, res } = createMockReqRes({ method, body });
  await handler(req, res);
  return res;
}

// This is a light smoke test for the API handler in isolation
(async () => {
  const res1 = await call('GET');
  if (!(Array.isArray(res1._data) && res1.statusCode === 200)) {
    throw new Error('GET should return 200 with an array of groups');
  }

  const res2 = await call('POST', { name: 'Specs' });
  if (!(res2.statusCode === 201 && res2._data && res2._data.name === 'Specs')) {
    throw new Error('POST should create a new group named Specs');
  }

  const res3 = await call('POST', { name: '' });
  if (!(res3.statusCode === 400)) {
    throw new Error('POST should validate name');
  }
})();
