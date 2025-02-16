"use client";

import { Module } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge
          className={`${
            isPublished && "bg-[#2caa43] hover:bg-[#FDAB04]"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },  
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Link
        href={`/admin/data-management/modules/${row.original.id}`}
        className="flex gap-2 items-center hover:text-[#FDAB04]"
      >
        <Pencil className="h-4 w-4" /> Edit
      </Link>
    ),
  },
];