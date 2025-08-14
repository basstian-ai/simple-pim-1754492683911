const { render, screen, fireEvent } = require('@testing-library/react');
const VariantMatrixEditor = require('../components/VariantMatrixEditor');

describe('VariantMatrixEditor', () => {
  test('renders correctly', () => {
    render(<VariantMatrixEditor />);
    expect(screen.getByText(/Variant Matrix Editor/i)).toBeInTheDocument();
  });

  test('bulk fill functionality', () => {
    render(<VariantMatrixEditor />);
    // Simulate bulk fill action
    fireEvent.click(screen.getByText(/Bulk Fill/i));
    // Add assertions to verify the expected outcome
  });

  test('undo functionality', () => {
    render(<VariantMatrixEditor />);
    // Simulate an edit and then undo
    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.click(screen.getByText(/Undo/i));
    // Add assertions to verify the expected outcome
  });
});