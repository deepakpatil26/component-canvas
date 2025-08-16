'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  idKey: keyof T;
}

type SortConfig<T> = {
  key: keyof T;
  direction: 'ascending' | 'descending';
} | null;

export function DataTable<T extends Record<keyof T, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  idKey,
}: DataTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Set<any>>(new Set());
  const [sortConfig, setSortConfig] = React.useState<SortConfig<T>>(null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  React.useEffect(() => {
    if (onRowSelect) {
      const selected = data.filter(item => selectedRowKeys.has(item[idKey]));
      onRowSelect(selected);
    }
  }, [selectedRowKeys, data, onRowSelect, idKey]);


  const requestSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(sortedData.map(row => row[idKey]));
      setSelectedRowKeys(allKeys);
    } else {
      setSelectedRowKeys(new Set());
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelectedRowKeys = new Set(selectedRowKeys);
    if (checked) {
      newSelectedRowKeys.add(row[idKey]);
    } else {
      newSelectedRowKeys.delete(row[idKey]);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };
  
  const isRowSelected = (row: T) => {
    return selectedRowKeys.has(row[idKey]);
  }

  const allRowsSelected = selectable && sortedData.length > 0 && selectedRowKeys.size === sortedData.length;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allRowsSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  aria-label="Select all rows"
                  disabled={loading || data.length === 0}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                onClick={column.sortable ? () => requestSort(column.dataIndex) : undefined}
                className={cn(column.sortable && 'cursor-pointer select-none hover:bg-muted/50')}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && sortConfig?.key === column.dataIndex ? (
                    sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                  ) : column.sortable ? <div className="h-4 w-4" /> : null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {selectable && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : sortedData.length > 0 ? (
            sortedData.map((row) => (
              <TableRow key={String(row[idKey])} data-state={isRowSelected(row) ? "selected" : ""}>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={isRowSelected(row)}
                      onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                      aria-label={`Select row ${String(row[idKey])}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.dataIndex], row) : String(row[column.dataIndex])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-24 text-center"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
