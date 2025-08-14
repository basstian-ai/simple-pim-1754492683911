const { render, screen, fireEvent } = require('@testing-library/react');
const VariantMatrixEditor = require('../components/VariantMatrixEditor');

describe('VariantMatrixEditor', () => {
  test('renders correctly', () => {
    render(<VariantMatrixEditor />);
    expect(screen.getByText(/Variant Matrix Editor/i)).toBeInTheDocument();
  });

  test('bulk fill functionality works', () => {
    render(<VariantMatrixEditor />);
    // Simulate filling and copying logic here
  });
});