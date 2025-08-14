import React from 'react';
import { render } from '@testing-library/react';
import CompletenessRuleBuilder from './CompletenessRuleBuilder';

test('renders Completeness Rule Builder', () => {
  const { getByText } = render(<CompletenessRuleBuilder />);
  const linkElement = getByText(/Completeness Rule Builder/i);
  expect(linkElement).toBeInTheDocument();
});
