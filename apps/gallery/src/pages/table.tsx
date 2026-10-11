import { useState } from 'react';
import type { Key } from 'react';
import { Badge, DataTable, Text } from '@mucsi96/react-ui';
import type { TableColumn } from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';

interface Person {
  name: string;
  interest: string;
  status: 'active' | 'paused' | 'archived';
  age: number;
}
const rows: Person[] = [
  { name: 'Chris', interest: 'HTML tables', status: 'active', age: 22 },
  { name: 'Dennis', interest: 'Web accessibility', status: 'active', age: 45 },
  { name: 'Sarah', interest: 'JavaScript frameworks', status: 'paused', age: 29 },
  { name: 'Karen', interest: 'Web performance', status: 'active', age: 36 },
  { name: 'Erik', interest: 'CSS layout', status: 'archived', age: 51 },
  { name: 'Maya', interest: 'Animation', status: 'paused', age: 27 },
];
const columns: TableColumn<Person>[] = [
  {
    id: 'name',
    label: 'Person',
    renderCell: (row) => <strong>{row.name}</strong>,
    compare: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: 'interest',
    label: 'Most interest in',
    renderCell: (row) => row.interest,
    compare: (a, b) => a.interest.localeCompare(b.interest),
  },
  {
    id: 'status',
    label: 'Status',
    renderCell: (row) => (
      <Badge
        tone={row.status === 'active' ? 'success' : row.status === 'paused' ? 'warn' : 'neutral'}
      >
        {row.status}
      </Badge>
    ),
    compare: (a, b) => a.status.localeCompare(b.status),
  },
  {
    id: 'age',
    label: 'Age',
    align: 'end',
    renderCell: (row) => row.age,
    compare: (a, b) => a.age - b.age,
  },
];

export default function TablePage() {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  return (
    <>
      <PageHeader
        title="Data table"
        description="A semantic HTML table with typed column definitions, three-state sorting, pagination, and optional controlled selection."
      />
      <Demo
        title="People"
        description="Click a column heading to sort. Select a person using the row action, and move through the results with the paginator."
        code={`const columns: TableColumn<Person>[] = [
  { id: 'name', label: 'Person', renderCell: (row) => row.name,
    compare: (a, b) => a.name.localeCompare(b.name) },
];

<DataTable caption="People" rows={people} columns={columns}
  getRowKey={(row) => row.name} pageSize={4}
  selectedKey={selectedKey} onSelectionChange={setSelectedKey} />`}
        stack
      >
        <DataTable
          caption="People directory"
          rows={rows}
          columns={columns}
          getRowKey={(row) => row.name}
          getRowLabel={(row) => row.name}
          pageSize={4}
          selectedKey={selectedKey}
          onSelectionChange={setSelectedKey}
        />
        <Text muted>
          {selectedKey ? `Selected: ${selectedKey}` : 'Select a person to see their details.'}
        </Text>
      </Demo>
      <Demo
        title="Empty state"
        code={`<DataTable caption="Search results" rows={[]} columns={columns}
  getRowKey={(row) => row.name} emptyMessage="No people match your search." />`}
        stack
      >
        <DataTable
          caption="Search results"
          rows={[]}
          columns={columns}
          getRowKey={(row) => row.name}
          emptyMessage="No people match your search."
        />
      </Demo>
    </>
  );
}
