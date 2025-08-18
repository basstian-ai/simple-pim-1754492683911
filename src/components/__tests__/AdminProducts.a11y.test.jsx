import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AdminProducts from '../AdminProducts';

expect.extend(toHaveNoViolations);

describe('AdminProducts accessibility', () => {
  it('has no axe-core accessibility violations', async () => {
    const products = [
      { sku: 'SKU-001', name: 'Sample product', inStock: true },
      { sku: 'SKU-002', name: 'Another product', inStock: false }
    ];

    const { container } = render(<AdminProducts products={products} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
