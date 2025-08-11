const React = require('react');
const { render } = require('@testing-library/react');
const AttributeGroupDetail = require('../components/AttributeGroupDetail').default || require('../components/AttributeGroupDetail');
const groups = require('../data/attribute-groups.json');

describe('AttributeGroupDetail component', () => {
  test('renders group name and first attribute details', () => {
    const group = Array.isArray(groups) && groups.length > 0 ? groups[0] : {
      id: 'g1', name: 'General', description: 'Fallback', attributes: [ { code: 'color', type: 'text', label: 'Color' } ]
    };
    const { container } = render(React.createElement(AttributeGroupDetail, { group }));
    expect(container.textContent).toContain(group.name);
    const first = group.attributes[0];
    const label = first.label || first.name || first.code;
    expect(container.textContent).toContain(label);
    expect(container.textContent).toContain(first.code);
  });
});
