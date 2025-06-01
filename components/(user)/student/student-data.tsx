"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportUsersToPDF } from "@/components/utils/exportToPDF";
import { SlidersHorizontal } from "lucide-react";

type Role = "student" | "admin";

export type Details = {
  id: number;
  name: string;
  email: string;
  birthday: Date;
  gender: "Male" | "Female";
  school: "MNCHS" | "BSNHS" | "SNHS" | "PBNHS" | "BNHS";
  id_no: string;
  role: Role;
};

interface UserDataTableProps {
  role: Role;
}

export const columns: ColumnDef<Details>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <CaretSortIcon className="ml-2 h-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <CaretSortIcon className="ml-2 h-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => {
      const birthday = row.getValue("birthday");
      const formattedBirthday = new Date(birthday as string).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      return <div>{formattedBirthday}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "school",
    header: "School",
    cell: ({ row }) => {
      const schoolMap: Record<string, string> = {
        MNCHS: "Marinduque National Comprehensive High School",
        BSNHS: "Butansapa National High School",
        SNHS: "Sayao National High School",
        PBNHS: "Puting Buhangin National High School",
        BNHS: "Balancan National High School",
      };
      const schoolCode = row.getValue("school") as string;
      const fullName = schoolMap[schoolCode] || schoolCode;
      return <div>{fullName}</div>;
    },
  },

  {
    accessorKey: "id_no",
    header: "Student ID",
    cell: ({ row }) => <div>{row.getValue("id_no")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        className="text-xs bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
        onClick={() =>
          (window.location.href = `/admin/reports/students-report/${row.original.id}`)
        }
      >
        View Reports
      </Button>
    ),
  },
];

export function UserDataTable({ role }: UserDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [users, setUsers] = React.useState<Details[]>([]);

  const [selectedFilters, setSelectedFilters] = React.useState<{
    gender: string[];
    school: string[];
    role: string[];
  }>({ gender: [], school: [], role: [] });

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/getuserbyrole?role=${role}`);
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Failed to fetch users:", data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [role]);

  const handleFilterChange = (
    category: "gender" | "school" | "role",
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedCategory };
    });
  };

  React.useEffect(() => {
    let filters: ColumnFiltersState = [];

    if (selectedFilters.gender.length) {
      filters.push({ id: "gender", value: selectedFilters.gender });
    }
    if (selectedFilters.school.length) {
      filters.push({ id: "school", value: selectedFilters.school });
    }
    if (selectedFilters.role.length) {
      filters.push({ id: "role", value: selectedFilters.role });
    }

    setColumnFilters(filters);
  }, [selectedFilters]);

  const handleExport = () => {
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    exportUsersToPDF(filteredData);
  };

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    getColumnCanGlobalFilter: (column) => column.id === "name", // ✅ Only "name" column searchable
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      {/* Search & Filter */}
      <div className="flex items-center space-x-2 py-4">
        <Input
          placeholder="Search for users..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2 w-64 p-4">
            {/* Gender */}
            <div className="flex flex-row gap-2">
              <div className="mb-2">
                <h4 className="text-sm font-medium">Gender</h4>
                {["Male", "Female"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFilters.gender.includes(gender)}
                      onCheckedChange={() =>
                        handleFilterChange("gender", gender)
                      }
                    />
                    <label className="text-sm">{gender}</label>
                  </div>
                ))}
              </div>

              {/* School */}
              <div className="mb-2">
                <h4 className="text-sm font-medium">School</h4>
                {["MNCHS", "BSNHS", "SNHS", "PBNHS", "BNHS"].map((school) => (
                  <div key={school} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFilters.school.includes(school)}
                      onCheckedChange={() =>
                        handleFilterChange("school", school)
                      }
                    />
                    <label className="text-sm">{school}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <Button
              variant="destructive"
              onClick={() =>
                setSelectedFilters({ gender: [], school: [], role: [] })
              }
              className="w-full mt-2"
            >
              Reset Filters
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-slate-100 dark:bg-slate-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={handleExport} className="px-6 border">
          Export to PDF
        </Button>
      </div>
    </div>
  );
}
