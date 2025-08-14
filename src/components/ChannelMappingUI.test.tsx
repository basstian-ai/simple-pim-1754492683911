import React from 'react';
import { render } from '@testing-library/react';
import ChannelMappingUI from './ChannelMappingUI';

test('renders Channel Mapping UI', () => {
  render(<ChannelMappingUI />);
  const linkElement = screen.getByText(/Channel Mapping UI/i);
  expect(linkElement).toBeInTheDocument();
});