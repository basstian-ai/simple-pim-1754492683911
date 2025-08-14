const { render, screen } = require('@testing-library/react');
const ChannelMappingUI = require('../src/ChannelMappingUI');

test('renders channel mapping UI', () => {
  render(<ChannelMappingUI />);
  expect(screen.getByText(/Visual mapping/i)).toBeInTheDocument();
  expect(screen.getByText(/Field transformers/i)).toBeInTheDocument();
  expect(screen.getByText(/Dry-run preview/i)).toBeInTheDocument();
});