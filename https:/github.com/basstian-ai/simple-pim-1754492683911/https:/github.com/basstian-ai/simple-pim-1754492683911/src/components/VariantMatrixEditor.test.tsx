// Tests for VariantMatrixEditor component
import React from 'react';
import { render } from '@testing-library/react';
import VariantMatrixEditor from './VariantMatrixEditor';

describe('VariantMatrixEditor', () => {
  it('renders without crashing', () => {
    render(<VariantMatrixEditor />);
  });
});