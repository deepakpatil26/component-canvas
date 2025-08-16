"use client";

import { useState, useCallback } from "react";
import { InputField } from "@/components/ui/input-field";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 28 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 34 },
  { id: 3, name: "Sam Green", email: "sam@example.com", age: 42 },
  { id: 4, name: "Alice Brown", email: "alice@example.com", age: 23 },
  { id: 5, name: "Bob Johnson", email: "bob@example.com", age: 55 },
];

type User = (typeof dummyUsers)[0];

const columns: Column<User>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

export default function Home() {
  const [inputValue, setInputValue] = useState("Some text");
  const [passwordValue, setPasswordValue] = useState("password123");
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableData, setTableData] = useState(dummyUsers);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const toggleTableLoading = () => {
    setLoadingTable(true);
    setTimeout(() => setLoadingTable(false), 2000);
  };

  const toggleTableEmpty = () => {
    if (tableData.length > 0) {
      setTableData([]);
    } else {
      setTableData(dummyUsers);
    }
  };

  const handleRowSelect = useCallback((rows: User[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8 md:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="relative text-center">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-primary md:text-5xl">
            Component Canvas
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A showcase of custom-built React components.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>InputField Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Variants</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <InputField
                  variant="outlined"
                  label="Outlined"
                  placeholder="Outlined input"
                />
                <InputField
                  variant="filled"
                  label="Filled"
                  placeholder="Filled input"
                />
                <InputField
                  variant="ghost"
                  label="Ghost"
                  placeholder="Ghost input"
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-xl font-semibold">Sizes</h3>
              <div className="grid items-start gap-6 md:grid-cols-3">
                <InputField size="sm" label="Small" placeholder="Small input" />
                <InputField
                  size="md"
                  label="Medium"
                  placeholder="Medium input"
                />
                <InputField size="lg" label="Large" placeholder="Large input" />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-xl font-semibold">States</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <InputField
                  disabled
                  label="Disabled"
                  placeholder="Disabled input"
                />
                <InputField
                  loading
                  label="Loading"
                  placeholder="Loading input"
                />
                <InputField
                  invalid
                  label="Invalid"
                  placeholder="Invalid input"
                  errorMessage="This field is required."
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-xl font-semibold">Features</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label="With Clear Button"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  showClearButton
                  helperText="This input can be cleared."
                />
                <InputField
                  label="Password Input"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  togglePasswordVisibility
                  helperText="Toggle visibility to see the password."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DataTable Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={toggleTableLoading} disabled={loadingTable}>
                {loadingTable ? "Loading..." : "Toggle Loading State"}
              </Button>
              <Button onClick={toggleTableEmpty} variant="outline">
                {tableData.length > 0 ? "Set Empty State" : "Set Data"}
              </Button>
            </div>
            <DataTable
              data={tableData}
              columns={columns}
              loading={loadingTable}
              selectable
              onRowSelect={handleRowSelect}
              idKey="id"
            />
            {selectedRows.length > 0 && (
              <div className="mt-4 rounded-lg bg-muted p-4">
                <h4 className="font-semibold">Selected Rows IDs:</h4>
                <pre className="mt-2 text-sm">
                  {JSON.stringify(
                    selectedRows.map((r) => r.id),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
