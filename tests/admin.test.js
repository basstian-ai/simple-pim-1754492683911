import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminHome from '../pages/admin/index';

describe('Admin dashboard', () => {
  it('renders heading and key links', () => {
    render(<AdminHome />);

    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Manage Attributes/i })).toHaveAttribute('href', '/admin/attributes');
    expect(screen.getByRole('link', { name: /Manage Attribute Groups/i })).toHaveAttribute('href', '/admin/attribute-groups');
    expect(screen.getByRole('link', { name: /Quick Add Product/i })).toHaveAttribute('href', '/admin/quick-add');
    expect(screen.getByRole('link', { name: /AI Tools/i })).toHaveAttribute('href', '/admin/ai-tools');
    expect(screen.getByRole('link', { name: /SKU Utilities/i })).toHaveAttribute('href', '/admin/sku');
    expect(screen.getByRole('link', { name: /Export Products CSV/i })).toHaveAttribute('href', '/api/products/export');
  });
});
