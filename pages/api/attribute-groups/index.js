import withErrorHandling from '../../../lib/api/withErrorHandling';

async function handler(req, res) {
  if (req.method === 'GET') {
    const { loadAttributeGroups } = require('../../../lib/attributeGroups');
    const groups = loadAttributeGroups();
    res.status(200).json({ groups });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,OPTIONS');
    res.status(204).end();
    return;
  }

  res.setHeader('Allow', 'GET,OPTIONS');
  res.status(405).json({ error: 'Method Not Allowed' });
}

export default withErrorHandling(handler);

