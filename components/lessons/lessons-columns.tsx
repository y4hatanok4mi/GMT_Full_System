"use client";

import { Lesson } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EditAction = ({ row }: { row: any }) => {
  const { moduleId } = useParams();

  return (
    <Link
      href={`/admin/data-management/modules/${moduleId}/lessons/${row.original.id}/basic`}
      className="flex gap-2 items-center hover:text-[#307d34]"
    >
      <Pencil className="h-4 w-4" /> Edit
    </Link>
  );
};

export const columns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "title",
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
            isPublished && "bg-[#FDAB04] text-black hover:bg-[#FDAB04]"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EditAction row={row} />,
  },
];
