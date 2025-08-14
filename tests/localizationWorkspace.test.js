const { render, screen } = require('@testing-library/react');
const LocalizationWorkspace = require('../src/LocalizationWorkspace');

test('renders side-by-side localization workspace', () => {
  render(<LocalizationWorkspace />);
  expect(screen.getByText(/source/i)).toBeInTheDocument();
  expect(screen.getByText(/target/i)).toBeInTheDocument();
});
