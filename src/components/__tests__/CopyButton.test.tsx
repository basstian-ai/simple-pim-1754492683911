import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CopyButton from '../CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('uses navigator.clipboard.writeText when available and announces success', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    // @ts-ignore - test harness mocking
    navigator.clipboard = { writeText };

    const { getByRole, getByTestId, queryByTestId } = render(
      <CopyButton textToCopy="hello" ariaLabel="Copy ID" successMessage="Copied ID" />
    );

    const btn = getByRole('button', { name: 'Copy ID' });
    fireEvent.click(btn);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('hello'));

    // live region should eventually contain the message
    const live = getByTestId('copy-live-region');
    await waitFor(() => expect(live.textContent).toBe('Copied ID'));

    // visible toast should appear and then be removed
    expect(queryByTestId('copy-toast')?.textContent).toBe('Copied ID');
    await waitFor(() => expect(queryByTestId('copy-toast')).toBeNull(), { timeout: 3500 });

    // focus should remain on the button
    expect(document.activeElement).toBe(btn);
  });

  test('falls back to document.execCommand when clipboard API missing', async () => {
    // Remove navigator.clipboard
    // @ts-ignore
    navigator.clipboard = undefined;

    const exec = jest.spyOn(document, 'execCommand').mockImplementation(() => true as any);

    const { getByRole, getByTestId } = render(
      <CopyButton textToCopy="fallback-text" ariaLabel="Copy Fallback" successMessage="OK" />
    );

    const btn = getByRole('button', { name: 'Copy Fallback' });
    fireEvent.click(btn);

    await waitFor(() => expect(exec).toHaveBeenCalledWith('copy'));

    const live = getByTestId('copy-live-region');
    await waitFor(() => expect(live.textContent).toBe('OK'));

    expect(document.activeElement).toBe(btn);
  });

  test('announces failure when both methods fail', async () => {
    // Mock clipboard writeText to reject
    const writeText = jest.fn().mockRejectedValue(new Error('n/a'));
    // @ts-ignore
    navigator.clipboard = { writeText };
    // And mock execCommand to fail
    const exec = jest.spyOn(document, 'execCommand').mockImplementation(() => false as any);

    const { getByRole, getByTestId } = render(
      <CopyButton textToCopy="t" ariaLabel="Copy Fail" failureMessage="Nope" />
    );

    const btn = getByRole('button', { name: 'Copy Fail' });
    fireEvent.click(btn);

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    await waitFor(() => expect(exec).toHaveBeenCalled());

    const live = getByTestId('copy-live-region');
    await waitFor(() => expect(live.textContent).toBe('Nope'));

    expect(document.activeElement).toBe(btn);
  });

  test('activates on Enter and Space keys', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    // @ts-ignore
    navigator.clipboard = { writeText };

    const { getByRole } = render(<CopyButton textToCopy="k" ariaLabel="Copy Keys" successMessage="Yup" />);
    const btn = getByRole('button', { name: 'Copy Keys' });

    fireEvent.keyDown(btn, { key: 'Enter' });
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    fireEvent.keyDown(btn, { key: ' ' });
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));

    expect(document.activeElement).toBe(btn);
  });
});
