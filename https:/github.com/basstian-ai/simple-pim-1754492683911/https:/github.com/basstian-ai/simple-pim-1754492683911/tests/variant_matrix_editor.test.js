import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VariantMatrixEditor from '../features/variant_matrix_editor';

describe('VariantMatrixEditor', () => {
  test('renders correctly', () => {
    const { getByText } = render(<VariantMatrixEditor />);
    expect(getByText(/Grid Editing/i)).toBeInTheDocument();
  });

  test('bulk copy functionality', () => {
    const { getByText } = render(<VariantMatrixEditor />);
    // Simulate bulk copy action
    fireEvent.click(getByText(/Copy/i));
    expect(getByText(/Attributes copied/i)).toBeInTheDocument();
  });
});