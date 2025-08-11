const handlerModule = require('../../pages/api/ai/name-suggest');
const handler = handlerModule && handlerModule.default ? handlerModule.default : handlerModule;
const generateNameSuggestions = require('../../lib/generateNameSuggestions');

jest.mock('../../lib/generateNameSuggestions');

describe('/api/ai/name-suggest', () => {
  beforeEach(() => jest.resetAllMocks());

  test('returns 405 for non-POST methods', async () => {
    const req = { method: 'GET' };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status };

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  test('returns suggestions for valid POST body', async () => {
    const req = { method: 'POST', body: { name: 'Blue T-Shirt', sku: 'TSHIRT-001' } };
    const fake = ['Blue T-Shirt - TSHIRT-001', 'Blue T-Shirt'];
    generateNameSuggestions.mockReturnValue(fake);

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status };

    await handler(req, res);

    expect(generateNameSuggestions).toHaveBeenCalledWith(req.body);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ suggestions: fake });
  });

  test('returns 500 when generateNameSuggestions throws', async () => {
    const req = { method: 'POST', body: { name: 'Faulty' } };
    generateNameSuggestions.mockImplementation(() => {
      throw new Error('boom');
    });

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status };

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'boom' });
  });
});
