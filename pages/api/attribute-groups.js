import fs from 'fs';
import path from 'path';

const { validateGroup, isCodeUnique, sanitizeGroup } = require('../../lib/attributeGroups');

// Load initial groups from data file once per cold start
const dataFile = path.join(process.cwd(), 'data', 'attribute-groups.json');
let initialGroups = [];
try {
  const raw = fs.readFileSync(dataFile, 'utf8');
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) initialGroups = parsed;
} catch (e) {
  initialGroups = [];
}

// Ephemeral in-memory store per serverless instance
let runtimeGroups = initialGroups.slice();

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ groups: runtimeGroups });
    return;
  }

  if (req.method === 'POST') {
    const payload = req.body || {};
    const { valid, errors, group } = validateGroup(payload);
    if (!valid) {
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }
    if (!isCodeUnique(runtimeGroups, group.code)) {
      res.status(409).json({ error: 'Code already exists' });
      return;
    }
    const sanitized = sanitizeGroup(group);
    runtimeGroups = runtimeGroups.concat([sanitized]);
    res.status(201).json({ group: sanitized });
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
