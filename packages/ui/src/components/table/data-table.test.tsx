import { useState } from 'react';
import type { Key } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { DataTable } from './data-table';

const rows = [
  { name: 'Zoe', age: 18 },
  { name: 'Alex', age: 30 },
  { name: 'Maya', age: 24 },
];
const columns = [
  {
    id: 'name',
    label: 'Name',
    renderCell: (row: (typeof rows)[number]) => row.name,
    compare: (a: (typeof rows)[number], b: (typeof rows)[number]) => a.name.localeCompare(b.name),
  },
];

it('sorts the entire dataset before paginating and resets sorting on the third activation', async () => {
  const user = userEvent.setup();
  render(
    <DataTable
      caption="People"
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.name}
      pageSize={2}
    />,
  );
  const table = screen.getByRole('table', { name: 'People' });
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Zoe');
  await user.click(screen.getByRole('button', { name: 'Name' }));
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Alex');
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(within(table).getByRole('cell')).toHaveTextContent('Zoe');
  await user.click(screen.getByRole('button', { name: 'Name' }));
  expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  await user.click(screen.getByRole('button', { name: 'Name' }));
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Zoe');
});

it('toggles controlled selection without relying on row pointer handlers', async () => {
  const user = userEvent.setup();
  function Example() {
    const [selected, setSelected] = useState<Key | null>(null);
    return (
      <DataTable
        caption="People"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.name}
        selectedKey={selected}
        onSelectionChange={setSelected}
      />
    );
  }
  render(<Example />);
  const button = screen.getByRole('button', { name: 'Select Zoe' });
  button.focus();
  await user.keyboard('{Enter}');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  await user.keyboard(' ');
  expect(button).toHaveAttribute('aria-pressed', 'false');
});

it('keeps pagination valid when the dataset shrinks or becomes empty', async () => {
  const user = userEvent.setup();
  const props = {
    caption: 'People',
    columns,
    getRowKey: (row: (typeof rows)[number]) => row.name,
    pageSize: 1,
  };
  const { rerender } = render(<DataTable {...props} rows={rows} />);
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  rerender(<DataTable {...props} rows={rows.slice(0, 1)} />);
  expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  expect(screen.getByText('Zoe')).toBeInTheDocument();
  rerender(<DataTable {...props} rows={[]} />);
  expect(screen.getByText('No results found.')).toBeInTheDocument();
  expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
});
