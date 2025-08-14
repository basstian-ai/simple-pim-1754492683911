// TransformSnippet.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TransformSnippet from '../components/TransformSnippet';

test('renders TransformSnippet and shows preview', () => {
  render(<TransformSnippet />);
  const button = screen.getByText(/Preview/i);
  button.click();
  expect(screen.getByText(/sample/)).toBeInTheDocument();
});
