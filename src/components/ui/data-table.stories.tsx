import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from './data-table';

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const dummyUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34 },
  { id: 3, name: 'Sam Green', email: 'sam@example.com', age: 42 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 23 },
  { id: 5, name: 'Bob Johnson', email: 'bob@example.com', age: 55 },
];

type User = typeof dummyUsers[0];

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

export const Default: Story = {
  args: {
    data: dummyUsers,
    columns: columns,
    idKey: 'id',
  },
};

export const Selectable: Story = {
  args: {
    ...Default.args,
    selectable: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    data: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
};
