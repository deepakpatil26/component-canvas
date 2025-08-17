"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type BaseRecord = Record<string, any>;

type Column<T extends BaseRecord> = {
  key: string;
  title: string;
  dataIndex?: string | string[];
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
};

type PaginationConfig = {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
};

type DataTableProps<T extends BaseRecord> = {
  // Data
  data: T[];
  columns: Column<T>[];

  // Selection
  selectable?: boolean | "single" | "multiple";
  onRowSelect?: (selectedRows: T[]) => void;
  idKey?: string;

  // Pagination
  pagination?: boolean | PaginationConfig;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onPaginationChange?: (pagination: { page: number; pageSize: number }) => void;

  // UI States
  loading?: boolean;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  className?: string;
  onRowClick?: (record: T, e: React.MouseEvent) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  footer?: React.ReactNode;
};

export function DataTable<T extends BaseRecord>({
  // Data
  data = [],
  columns = [],

  // Selection
  selectable = false,
  onRowSelect,
  idKey = "id",

  // Pagination
  pagination: paginationProp = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPaginationChange,

  // UI States
  loading = false,
  emptyState,
  loadingState,
  className = "",
  onRowClick,
  showHeader = true,
  showFooter = false,
  footer,
}: DataTableProps<T>) {
  // State
  const [pagination, setPagination] = React.useState<PaginationConfig>({
    page: 1,
    pageSize: defaultPageSize,
    total: data.length,
    pageSizeOptions,
  });

  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "ascend" | "descend" | null;
  }>({ key: "", direction: null });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  // Derived state
  const currentPagination =
    typeof paginationProp === "object" ? paginationProp : pagination;
  const { page, pageSize, total } = currentPagination;

  // Handlers
  const handlePageChange = (newPage: number) => {
    if (typeof paginationProp === "object") {
      onPaginationChange?.({
        page: newPage,
        pageSize,
      });
    } else {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof paginationProp === "object") {
      onPaginationChange?.({
        page: 1,
        pageSize: newPageSize,
      });
    } else {
      setPagination((prev) => ({
        ...prev,
        page: 1,
        pageSize: newPageSize,
      }));
    }
  };

  const toggleRowSelection = (key: React.Key, selected: boolean) => {
    if (!selectable) return;

    let newSelectedKeys: React.Key[] = [];

    if (selectable === "single" || selectable === true) {
      newSelectedKeys = selected ? [key] : [];
    } else {
      newSelectedKeys = selected
        ? [...selectedRowKeys, key]
        : selectedRowKeys.filter((k) => k !== key);
    }

    setSelectedRowKeys(newSelectedKeys);

    if (onRowSelect) {
      const selectedRecords = data.filter((item) => {
        const recordKey = idKey ? item[idKey] : (item as any).id;
        return newSelectedKeys.includes(recordKey);
      });
      onRowSelect(selectedRecords);
    }
  };

  const isRowSelected = (key: React.Key) => selectedRowKeys.includes(key);

  const allRowsSelected =
    selectable &&
    data.length > 0 &&
    data.every((row) => {
      const rowKeyValue = idKey ? row[idKey] : (row as any).id;
      return selectedRowKeys.includes(rowKeyValue);
    });

  const someRowsSelected =
    selectable && selectedRowKeys.length > 0 && !allRowsSelected;

  const handleRowClick = (record: T, e: React.MouseEvent) => {
    onRowClick?.(record, e);

    if (selectable) {
      const recordKey = idKey ? record[idKey] : (record as any).id;
      const isSelected = isRowSelected(recordKey);
      toggleRowSelection(recordKey, !isSelected);
    }
  };

  const toggleSelectAll = (selected: boolean) => {
    if (selected) {
      const allRowKeys = data.map((row) =>
        idKey ? row[idKey] : (row as any).id
      );
      setSelectedRowKeys(allRowKeys);
      onRowSelect?.(data);
    } else {
      setSelectedRowKeys([]);
      onRowSelect?.([]);
    }
  };

  // Process data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue == null) return sortConfig.direction === "ascend" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "ascend" ? 1 : -1;

      return sortConfig.direction === "ascend"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    if (!paginationProp) return sortedData;

    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, paginationProp, page, pageSize]);

  // Render helpers
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        {selectable && (
          <TableHead className="w-12">
            <Checkbox
              checked={allRowsSelected}
              {...(someRowsSelected ? { "data-state": "indeterminate" } : {})}
              onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
            />
          </TableHead>
        )}
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className={column.align ? `text-${column.align}` : ""}
            style={{ width: column.width }}
          >
            <div className="flex items-center">
              <span>{column.title}</span>
              {column.sortable && (
                <button
                  onClick={() => {
                    setSortConfig((prev) => ({
                      key: column.key,
                      direction:
                        prev.key === column.key && prev.direction === "ascend"
                          ? "descend"
                          : "ascend",
                    }));
                  }}
                  className="ml-2"
                >
                  {sortConfig.key === column.key &&
                  sortConfig.direction === "ascend"
                    ? "↑"
                    : "↓"}
                </button>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length + (selectable ? 1 : 0)}
              className="text-center py-8"
            >
              {loadingState || "Loading..."}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length + (selectable ? 1 : 0)}
              className="text-center py-8"
            >
              {emptyState || "No data available"}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedData.map((row, rowIndex) => {
          const rowKey = idKey ? row[idKey] : rowIndex;
          const isSelected = isRowSelected(rowKey);

          return (
            <TableRow
              key={rowKey}
              className={`${
                onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
              } ${isSelected ? "bg-blue-50" : ""}`}
              onClick={(e) => handleRowClick(row, e)}
            >
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      toggleRowSelection(rowKey, checked as boolean);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              )}
              {columns.map((column) => {
                const value = column.dataIndex
                  ? Array.isArray(column.dataIndex)
                    ? column.dataIndex.reduce(
                        (obj, key) => (obj || {})[key],
                        row
                      )
                    : row[column.dataIndex as string]
                  : row[column.key];

                return (
                  <TableCell
                    key={column.key}
                    className={column.align ? `text-${column.align}` : ""}
                  >
                    {column.render
                      ? column.render(value, row)
                      : String(value ?? "")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  const renderPagination = () => {
    if (!paginationProp) return null;

    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-500">
          Showing {start} to {end} of {total} entries
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              ‹
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={page >= totalPages}
            >
              »
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className={`space-y-4 ${className}`}>
      {paginationProp && renderPagination()}

      <div className="rounded-md border">
        <Table>
          {showHeader && renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>

      {showFooter && footer && (
        <div className="px-4 py-2 border-t">{footer}</div>
      )}

      {paginationProp && renderPagination()}
    </div>
  );
}

export default DataTable;
