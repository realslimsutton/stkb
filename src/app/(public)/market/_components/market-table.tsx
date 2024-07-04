"use client";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import * as React from "react";
import Avatar from "~/components/ui/avatar";
import { DataTable } from "~/components/ui/datatable";
import useDataTable from "~/hooks/use-data-table";
import { formatDuration, formatNumber } from "~/lib/formatter";
import { blueprints } from "~/server/db/schema";
import { blueprintTypes } from "~/shop-titans/data/enums";
import { DataTableColumnHeader } from "../../../../components/ui/datatable/column-header";

import { ExternalLinkIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

const columns: ColumnDef<InferSelectModel<typeof blueprints>>[] = [
  {
    accessorKey: "image",
    header: () => null,
    cell: ({ row }) => (
      <Avatar src={row.original.image} alt={row.original.name} />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "type",
    accessorFn: (row) =>
      blueprintTypes[row.type as keyof typeof blueprintTypes],
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "tier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.tier)}</>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.value)}</>,
  },
  {
    accessorKey: "experience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant XP" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.experience)}</>,
  },
  {
    accessorKey: "craftExperience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Worker XP" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.craftExperience)}</>,
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Craft Time" />
    ),
    cell: ({ row }) => <>{formatDuration(row.original.time)}</>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link
              href={`https://playshoptitans.com/blueprints/${row.original.category}/${row.original.type}/${row.original.id}`}
              target="_blank"
              className="flex cursor-pointer items-center gap-1"
            >
              View blueprint
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function MarketTable({
  dataLoader,
}: {
  dataLoader: Promise<InferSelectModel<typeof blueprints>[]>;
}) {
  const data = React.use(dataLoader);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { table } = useDataTable({
    data,
    columns,
    defaultPerPage: 10,
    defaultSort: "name.asc",
    columnVisibility,
    setColumnVisibility,
  });

  return (
    <>
      <div className="flex items-center p-4">
        <Input
          placeholder="Filter by names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <DataTable table={table}></DataTable>
    </>
  );
}
