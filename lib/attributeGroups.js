'use strict';

function slugifyGroupName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'group';
}

function inferGroup(code) {
  const c = String(code || '').toLowerCase();
  if (/price|cost|currency/.test(c)) return 'Pricing';
  if (/meta|seo|slug|title|description/.test(c)) return 'SEO';
  if (/stock|inventory|qty|quantity/.test(c)) return 'Inventory';
  return 'Basic';
}

function computeAttributeGroups(attributes) {
  const acc = Object.create(null);
  (attributes || []).forEach((attr) => {
    if (!attr || !attr.code) return;
    const groupName = attr.group || inferGroup(attr.code);
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push({ code: attr.code, label: attr.label || attr.code });
  });
  const groups = Object.keys(acc)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ id: slugifyGroupName(name), name, attributes: acc[name] }));
  return groups;
}

module.exports = { computeAttributeGroups, inferGroup, slugifyGroupName };
