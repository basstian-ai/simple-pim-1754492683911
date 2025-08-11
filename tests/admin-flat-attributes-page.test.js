const React = require('react');
const { render, screen } = require('@testing-library/react');
const mod = require('../pages/admin/flat-attributes');
const Page = mod.default || mod;

describe('Admin Flat Attributes Page', () => {
  test('renders heading and flattened rows', () => {
    const attrs = [
      { code: 'material', name: 'Material', type: 'text', groupId: 'grp-seo', groupName: 'SEO' },
      { code: 'weight', name: 'Weight', type: 'number', groupId: 'grp-shipping', groupName: 'Shipping' },
    ];
    render(React.createElement(Page, { attributes: attrs, count: attrs.length }));

    expect(screen.getByText(/Flat Attributes/i)).toBeInTheDocument();
    expect(screen.getByText('material')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
  });
});
