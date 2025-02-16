"use client"

import { useState, useEffect } from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

export type Details = {
  id: number;
  name: string;
  email: string;
  birthday: Date;
  gender: "Male" | "Female";
  school: "MNCHS" | "BSNHS" | "SNHS" | "PBNHS" | "BNHS";
  id_no: string;
  role: "student" | "admin";
};

export function UserDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [users, setUsers] = useState<Details[]>([]);
  const [selectedUser, setSelectedUser] = useState<Details | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user-control");
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
  }, []);

  const handleEdit = (user: Details) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete("/api/user-control", { data: { id: selectedUser.id } });
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user:");
    }
    setDeleteOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      await axios.put("/api/user-control", selectedUser);
      setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Error updating user:");
    }
    setEditOpen(false);
  };

  const columns: ColumnDef<Details>[] = [
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
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "birthday",
      header: "Birthday",
      cell: ({ row }) => {
        const birthday = row.getValue("birthday");
        const formattedBirthday = new Date(birthday as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
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
      cell: ({ row }) => <div>{row.getValue("school")}</div>,
    },
    {
      accessorKey: "id_no",
      header: "ID No.",
      cell: ({ row }) => <div>{row.getValue("id_no")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search for users..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              value={selectedUser?.name || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser!, name: e.target.value })}
            />
          </div>
          <div>
          <Label htmlFor="school">School</Label>
            <Select
              value={selectedUser?.school || ""}
              onValueChange={(value) =>
                setSelectedUser({ ...selectedUser!, school: value as "MNCHS" | "BSNHS" | "SNHS" | "PBNHS" | "BNHS" })
              }
            >
              <SelectTrigger>
                <span>{selectedUser?.school || "Select School"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SNHS">Sayao National High School</SelectItem>
                <SelectItem value="BNHS">Balanacan National High School</SelectItem>
                <SelectItem value="MNCHS">Mogpog National Comprehensive High School</SelectItem>
                <SelectItem value="BSNHS">Butansapa National High School</SelectItem>
                <SelectItem value="PBNHS">Puting Buhangin National High School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
          <Label htmlFor="id_no">ID Number</Label>
            <Input
              value={selectedUser?.id_no || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser!, id_no: e.target.value })}
            />
          </div>
          {/* Birthday Input */}
          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={selectedUser?.birthday ? new Date(selectedUser.birthday).toISOString().split('T')[0] : ""}
              onChange={(e) => {
                const newBirthday = new Date(e.target.value); // Convert the input value to a Date
                setSelectedUser({ ...selectedUser!, birthday: newBirthday });
              }}
              className="input-class"  // Use your custom input class here (Tailwind classes)
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the user &quot;{selectedUser?.name}&quot;?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-500">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
