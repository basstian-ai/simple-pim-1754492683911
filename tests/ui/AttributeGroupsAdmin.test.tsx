import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AttributeGroupsAdmin from '../../src/ui/admin/AttributeGroupsAdmin';

// Simple fetch mock helper
function mockFetchSequence(responses: Array<{ status?: number; body?: any }>) {
  let i = 0;
  // @ts-ignore
  global.fetch = jest.fn().mockImplementation(() => {
    const next = responses[i++] || { status: 200, body: null };
    const ok = (next.status ?? 200) >= 200 && (next.status ?? 200) < 300;
    return Promise.resolve({
      ok,
      status: next.status ?? 200,
      json: () => Promise.resolve(next.body),
    });
  });
}

afterEach(() => {
  // @ts-ignore
  global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
});

test('renders list and creates a group (optimistic -> server replaces)', async () => {
  const initial = [];
  // Sequence: initial list fetch, create POST response
  const createdServer = { id: 'g1', name: 'New Group', attributes: ['a', 'b'] };
  mockFetchSequence([
    { status: 200, body: initial },
    { status: 201, body: createdServer },
  ]);

  render(<AttributeGroupsAdmin />);
  expect(screen.getByText(/Loading attribute groups/)).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText(/Loading attribute groups/)).not.toBeInTheDocument());

  const nameInput = screen.getByLabelText(/Name/);
  const attrsInput = screen.getByLabelText(/Attributes/);
  const form = screen.getByRole('form', { name: /create-form/ }) as HTMLFormElement | null;

  fireEvent.change(nameInput, { target: { value: 'New Group' } });
  fireEvent.change(attrsInput, { target: { value: 'a, b' } });

  fireEvent.submit(form!);

  // Optimistic item appears with tmp id
  await waitFor(() => {
    expect(screen.getByText('New Group')).toBeInTheDocument();
  });

  // After server response the item should exist with server id
  await waitFor(() => {
    expect(screen.getByTestId('group-g1')).toBeInTheDocument();
  });
});

test('delete triggers optimistic removal and rollback on failure', async () => {
  const existing = [{ id: 'g2', name: 'ToDelete', attributes: ['x'] }];
  // initial list, delete response (500)
  mockFetchSequence([
    { status: 200, body: existing },
    { status: 500, body: { error: 'boom' } },
  ]);

  render(<AttributeGroupsAdmin />);
  await waitFor(() => expect(screen.queryByText(/Loading attribute groups/)).not.toBeInTheDocument());
  expect(screen.getByTestId('group-g2')).toBeInTheDocument();

  const deleteBtn = screen.getByLabelText('delete-g2');
  fireEvent.click(deleteBtn);

  // Immediately removed optimistically
  await waitFor(() => expect(screen.queryByTestId('group-g2')).not.toBeInTheDocument());

  // After failed delete it should rollback and reappear
  await waitFor(() => expect(screen.getByTestId('group-g2')).toBeInTheDocument());
});
