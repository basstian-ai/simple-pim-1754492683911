import React from 'react';
import { render, fireEvent } from '@testing-library/react';

// Mock next/router used by the page
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    pathname: '/',
    query: {},
    replace: jest.fn(),
  }),
}));

// Prevent actual fetch calls triggered by the component's effects
beforeAll(() => {
  global.fetch = jest.fn().mockImplementation((...args) => {
    // return a generic ok response with empty array JSON for tags/products
    return Promise.resolve({ json: async () => [] });
  });
});

afterAll(() => {
  delete global.fetch;
});

// Import after mocking router
import Home from '../pages/index';

test("pressing '/' focuses the search input on home page", async () => {
  const { getByLabelText } = render(<Home />);
  const input = getByLabelText('Search products');
  // ensure it's not focused initially
  expect(document.activeElement).not.toBe(input);

  // simulate pressing '/'
  fireEvent.keyDown(window, { key: '/', code: 'Slash', keyCode: 191 });

  expect(document.activeElement).toBe(input);
});
