import React from 'react';
import { render, cleanup } from '@testing-library/react';
import useDirection from '../src/hooks/useDirection';

afterEach(() => {
  // cleanup resets render and ensures effect unmount runs
  cleanup();
  if (typeof document !== 'undefined') {
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('data-locale');
  }
});

function Fixture({ locale }: { locale?: string }) {
  useDirection(locale);
  return <div data-testid="fixture">ok</div>;
}

describe('useDirection hook', () => {
  test('sets document.documentElement.dir to rtl for RTL locale', () => {
    render(<Fixture locale="ar-SA" />);
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('data-locale')).toBe('ar-SA');
  });

  test('sets document.documentElement.dir to ltr for LTR locale', () => {
    render(<Fixture locale="en-US" />);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(document.documentElement.getAttribute('data-locale')).toBe('en-US');
  });

  test('restores previous dir on unmount', () => {
    // set an explicit previous value
    document.documentElement.setAttribute('dir', 'ltr');
    const { unmount } = render(<Fixture locale="ar" />);

    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    unmount();
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });
});
