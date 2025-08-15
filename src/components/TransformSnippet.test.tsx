import React from 'react';
import { render } from '@testing-library/react';
import TransformPreview from './TransformPreview';

test('renders JSON preview', () => {
  const json = { test: 'value' };
  const { getByText } = render(<TransformPreview json={json} />);
  expect(getByText(/test/i)).toBeInTheDocument();
});
