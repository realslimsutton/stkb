"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import * as React from "react";
import Avatar from "~/components/ui/avatar";
import { DataTable } from "~/components/ui/datatable";
import useDataTable from "~/hooks/use-data-table";
import { formatDuration, formatNumber } from "~/lib/formatter";
import { blueprints } from "~/server/db/schema";
import { blueprintCategories, blueprintTypes } from "~/shop-titans/data/enums";
import { DataTableColumnHeader } from "../../../../components/ui/datatable/column-header";

import { ExternalLinkIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
} from "~/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { capitalise } from "~/lib/utils";

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
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <>{blueprintTypes[row.original.type as keyof typeof blueprintTypes]}</>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue?.length === 0) {
        return true;
      }

      return filterValue.includes(row.original.type);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue?.length === 0) {
        return true;
      }

      return filterValue.includes(row.original.category);
    },
  },
  {
    accessorKey: "tier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.tier)}</>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue?.length === 0) {
        return true;
      }

      return filterValue.includes(row.original.tier.toString());
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        <Image src="/images/icon_gold.webp" alt="Gold" height="20" width="20" />
        {formatNumber(row.original.value)}
      </span>
    ),
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

  const tierFilterOptions = React.useMemo(
    () =>
      Array.from({ length: 14 }, (v, i) => i + 1).map((tier) => ({
        value: tier.toString(),
        label: `Tier ${tier}`,
      })),
    [],
  );

  const typeFilterOptions = React.useMemo(
    () =>
      Object.entries(blueprintTypes).map(([value, label]) => ({
        value,
        label,
      })),
    [blueprintTypes],
  );

  const categoryFilterOptions = React.useMemo(() => {
    return Object.keys(blueprintCategories).map((category) => ({
      value: category,
      label: capitalise(category),
    }));
  }, [blueprintCategories]);

  const { table } = useDataTable({
    data,
    columns,
    defaultPerPage: 10,
    columnVisibility: {
      category: false,
    },
  });

  const filterableColumns = React.useMemo(() => {
    return {
      name: table.getColumn("name")!,
      tier: table.getColumn("tier")!,
      type: table.getColumn("type")!,
      category: table.getColumn("category")!,
    };
  }, [table]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <Input
          placeholder="Filter by names..."
          value={(filterableColumns.name.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            filterableColumns.name.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button>Filters</Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 space-y-4">
              <div>
                <Label className="space-y-2">
                  <span>Tiers</span>
                  <MultiSelect
                    onValueChange={(value) => {
                      table.getColumn("tier")?.setFilterValue(value);
                    }}
                  >
                    <MultiSelectTrigger>
                      <MultiSelectValue placeholder="Select stack" />
                    </MultiSelectTrigger>

                    <MultiSelectContent>
                      <MultiSelectSearch />

                      <MultiSelectList>
                        {tierFilterOptions.map((option) => (
                          <MultiSelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectList>
                    </MultiSelectContent>
                  </MultiSelect>
                </Label>
              </div>

              <div>
                <Label className="space-y-2">
                  <span>Types</span>
                  <MultiSelect
                    onValueChange={(value) => {
                      filterableColumns.type.setFilterValue(value);
                    }}
                  >
                    <MultiSelectTrigger>
                      <MultiSelectValue placeholder="Select stack" />
                    </MultiSelectTrigger>

                    <MultiSelectContent>
                      <MultiSelectSearch />

                      <MultiSelectList>
                        {typeFilterOptions.map((option) => (
                          <MultiSelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectList>
                    </MultiSelectContent>
                  </MultiSelect>
                </Label>
              </div>

              <div>
                <Label className="space-y-2">
                  <span>Category</span>
                  <MultiSelect
                    onValueChange={(value) => {
                      filterableColumns.category.setFilterValue(value);
                    }}
                  >
                    <MultiSelectTrigger>
                      <MultiSelectValue placeholder="Select stack" />
                    </MultiSelectTrigger>

                    <MultiSelectContent>
                      <MultiSelectSearch />

                      <MultiSelectList>
                        {categoryFilterOptions.map((option) => (
                          <MultiSelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectList>
                    </MultiSelectContent>
                  </MultiSelect>
                </Label>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <DataTable table={table}></DataTable>
    </>
  );
}
