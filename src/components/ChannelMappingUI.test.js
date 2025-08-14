import React from 'react';
import { render } from '@testing-library/react';
import ChannelMappingUI from './ChannelMappingUI';

test('renders Channel Mapping UI', () => {
    const { getByText } = render(<ChannelMappingUI />);
    const linkElement = getByText(/Channel Mapping UI/i);
    expect(linkElement).toBeInTheDocument();
});