import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {RecentFailureItem, FailureItem} from './RecentFailureItem';

// Polyfill navigator.clipboard.writeText for the test environment if missing
if (!global.navigator) {
  // @ts-ignore
  global.navigator = {};
}

if (!navigator.clipboard) {
  // @ts-ignore
  navigator.clipboard = { writeText: jest.fn() };
}

describe('RecentFailureItem quick actions', () => {
  const item: FailureItem = {
    id: 'job-123',
    title: 'Export to Channel X',
    errorText: 'Timeout while uploading payload',
    payload: { sku: 'SKU-1', reason: 'size-limit' },
  };

  test('opens overflow menu and copies error text to clipboard', async () => {
    const notify = jest.fn();
    const writeSpy = jest.spyOn(navigator.clipboard as any, 'writeText').mockResolvedValue(undefined);

    render(<RecentFailureItem item={item} onNotify={notify} />);

    const overflow = screen.getByTestId('overflow-button');
    fireEvent.click(overflow);

    const copyErrorBtn = screen.getByTestId('action-copy-error');
    fireEvent.click(copyErrorBtn);

    await waitFor(() => expect(writeSpy).toHaveBeenCalledWith(item.errorText));
    expect(notify).toHaveBeenCalledWith('Copied to clipboard');

    writeSpy.mockRestore();
  });

  test('copies job id to clipboard', async () => {
    const notify = jest.fn();
    const writeSpy = jest.spyOn(navigator.clipboard as any, 'writeText').mockResolvedValue(undefined);

    render(<RecentFailureItem item={item} onNotify={notify} />);

    fireEvent.click(screen.getByTestId('overflow-button'));
    fireEvent.click(screen.getByTestId('action-copy-jobid'));

    await waitFor(() => expect(writeSpy).toHaveBeenCalledWith(item.id));
    expect(notify).toHaveBeenCalledWith('Copied to clipboard');

    writeSpy.mockRestore();
  });

  test('downloads payload when available', async () => {
    const notify = jest.fn();

    // spy on anchor click
    const clickSpy = jest.fn();
    // Mock createObjectURL and anchor click behavior
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:mock');
    const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    // Mock anchor click by overriding prototype
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: any) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        // @ts-ignore
        el.click = clickSpy;
      }
      return el;
    });

    render(<RecentFailureItem item={item} onNotify={notify} />);

    fireEvent.click(screen.getByTestId('overflow-button'));
    fireEvent.click(screen.getByTestId('action-download-payload'));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith('Download started');

    createObjectURLSpy.mockRestore();
    revokeSpy.mockRestore();
    // restore createElement mock
    // @ts-ignore
    document.createElement.mockRestore && document.createElement.mockRestore();
  });

  test('shows message when payload is missing', async () => {
    const notify = jest.fn();
    const itemNoPayload: FailureItem = {...item, id: 'job-456', payload: undefined};

    render(<RecentFailureItem item={itemNoPayload} onNotify={notify} />);

    fireEvent.click(screen.getByTestId('overflow-button'));
    fireEvent.click(screen.getByTestId('action-download-payload'));

    await waitFor(() => expect(notify).toHaveBeenCalledWith('No payload available for this item'));
  });
});
