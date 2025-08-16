import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable, type Column } from './data-table';

interface TestData {
  id: number;
  name: string;
  value: number;
}

const testData: TestData[] = [
  { id: 1, name: 'Item 1', value: 100 },
  { id: 2, name: 'Item 2', value: 200 },
];

const testColumns: Column<TestData>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'value', title: 'Value', dataIndex: 'value' },
];

describe('DataTable', () => {
  it('renders the table with data', () => {
    render(<DataTable data={testData} columns={testColumns} idKey="id" />);

    const nameHeader = screen.getByText('Name');
    const valueHeader = screen.getByText('Value');
    expect(nameHeader).toBeInTheDocument();
    expect(valueHeader).toBeInTheDocument();

    const row1Name = screen.getByText('Item 1');
    const row2Value = screen.getByText('200');
    expect(row1Name).toBeInTheDocument();
    expect(row2Value).toBeInTheDocument();
  });

  it('renders the empty state when no data is provided', () => {
    render(<DataTable data={[]} columns={testColumns} idKey="id" />);
    const emptyMessage = screen.getByText('No results found.');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('renders the loading state', () => {
    render(<DataTable data={[]} columns={testColumns} loading={true} idKey="id" />);
    // Check for skeletons, assuming they have a specific role or class.
    // For this basic test, we can just check if "No results found" is NOT there.
    const emptyMessage = screen.queryByText('No results found.');
    expect(emptyMessage).not.toBeInTheDocument();
  });

  it('renders checkboxes when selectable is true', () => {
    render(<DataTable data={testData} columns={testColumns} selectable idKey="id" />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 for header + 2 for rows
    expect(checkboxes).toHaveLength(3);
  });
});
