// ChannelMappingUI component tests
import React from 'react';
import { render } from '@testing-library/react';
import ChannelMappingUI from './ChannelMappingUI';

test('renders Channel Mapping UI', () => {
  const { getByText } = render(<ChannelMappingUI />);
  expect(getByText(/Channel Mapping UI/i)).toBeInTheDocument();
});