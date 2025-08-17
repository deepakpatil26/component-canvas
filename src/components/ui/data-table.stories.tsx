import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./data-table-simple";
import { Badge } from "./badge";
import { Button } from "./button";

// Mock data
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  status: "Active" | "Inactive" | "Pending";
  role: "Admin" | "User" | "Editor";
};

const generateMockUsers = (count: number): User[] => {
  const statuses: ("Active" | "Inactive" | "Pending")[] = [
    "Active",
    "Inactive",
    "Pending",
  ];
  const roles: ("Admin" | "User" | "Editor")[] = ["Admin", "User", "Editor"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 18,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
  }));
};

const mockUsers = generateMockUsers(50);

// Define columns
const columns = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    sortable: true,
  },
  {
    key: "email",
    title: "Email",
    dataIndex: "email",
    sortable: true,
  },
  {
    key: "age",
    title: "Age",
    dataIndex: "age",
    sortable: true,
    align: "right" as const,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === "Active" ? "default" : "outline"}>
        {value}
      </Badge>
    ),
  },
  {
    key: "role",
    title: "Role",
    dataIndex: "role",
    sortable: true,
  },
  {
    key: "actions",
    title: "Actions",
    render: (_: any, record: User) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Edit", record.id)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => console.log("Delete", record.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selectable: {
      control: { type: "select" },
      options: [false, true, "single", "multiple"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {
  args: {
    data: mockUsers,
    columns,
    idKey: "id",
    pagination: {
      page: 1,
      pageSize: 10,
      total: mockUsers.length,
    },
  },
};

export const Selectable: Story = {
  args: {
    ...Default.args,
    selectable: "multiple",
    onRowSelect: (selectedRows) => console.log("Selected Rows:", selectedRows),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    loadingState: "Loading users...",
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyState: "No users found",
  },
};

export const WithCustomPagination: Story = {
  args: {
    ...Default.args,
    pagination: {
      page: 1,
      pageSize: 5,
      total: mockUsers.length,
      pageSizeOptions: [5, 10, 20, 50],
    },
  },
};

export const WithRowClick: Story = {
  args: {
    ...Default.args,
    onRowClick: (record, e) => {
      e.preventDefault();
      console.log("Row clicked:", record);
    },
  },
};
