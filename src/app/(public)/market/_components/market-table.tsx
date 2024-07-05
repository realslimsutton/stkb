"use client";

import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import * as React from "react";
import Avatar from "~/components/ui/avatar";
import { DataTable } from "~/components/ui/datatable";
import useDataTable from "~/hooks/use-data-table";
import {
  capitalise,
  formatArray,
  formatDuration,
  formatNumber,
} from "~/lib/formatter";
import { blueprints } from "~/server/db/schema";
import { blueprintCategories, blueprintTypes } from "~/shop-titans/data/enums";
import { DataTableColumnHeader } from "../../../../components/ui/datatable/column-header";

import { ExternalLinkIcon, MoreHorizontal, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
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
import { z } from "zod";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { createQueryString } from "~/lib/utils";
import useParsedSearchParams from "~/hooks/use-parsed-search-params";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

type Record = InferSelectModel<typeof blueprints>;

const columns: ColumnDef<Record>[] = [
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

const searchParamsSchema = z.object({
  search: z.string().optional(),
  tiers: z.array(z.string()).optional().catch([]),
  types: z.array(z.string()).optional().catch([]),
  categories: z.array(z.string()).optional().catch([]),
});

export default function MarketTable({
  dataLoader,
}: {
  dataLoader: Promise<InferSelectModel<typeof blueprints>[]>;
}) {
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParams(
    searchParams,
    searchParamsSchema,
  );

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

  const [search, setSearch] = React.useState(parsedSearchParams.search ?? "");
  const [tiers, setTiers] = React.useState(parsedSearchParams.tiers ?? []);
  const [types, setTypes] = React.useState(parsedSearchParams.types ?? []);
  const [categories, setCategories] = React.useState(
    parsedSearchParams.categories ?? [],
  );

  const { table } = useDataTable({
    data,
    columns,
    defaultPerPage: 10,
    columnVisibility: {
      category: false,
    },
    initialState: {
      columnFilters: [
        {
          id: "tier",
          value: tiers,
        },
        {
          id: "type",
          value: types,
        },
        {
          id: "category",
          value: categories,
        },
        {
          id: "name",
          value: search,
        },
      ],
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

  React.useEffect(() => {
    filterableColumns.name.setFilterValue(search);
  }, [filterableColumns, search]);

  React.useEffect(() => {
    filterableColumns.tier.setFilterValue(tiers);
  }, [filterableColumns, tiers]);

  React.useEffect(() => {
    filterableColumns.type.setFilterValue(types);
  }, [filterableColumns, types]);

  React.useEffect(() => {
    filterableColumns.category.setFilterValue(categories);
  }, [filterableColumns, categories]);

  return (
    <>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <Input
            placeholder="Filter by names..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            className="sm:max-w-sm"
          />
        </div>

        <div className="flex items-center justify-end">
          <TableFiltersWrapper
            tierFilterOptions={tierFilterOptions}
            tiers={tiers}
            setTiers={setTiers}
            typeFilterOptions={typeFilterOptions}
            types={types}
            setTypes={setTypes}
            categoryFilterOptions={categoryFilterOptions}
            categories={categories}
            setCategories={setCategories}
          />
        </div>
      </div>

      <TableFilterStatus
        search={search}
        setSearch={setSearch}
        tiers={tiers}
        setTiers={setTiers}
        types={types}
        setTypes={setTypes}
        categories={categories}
        setCategories={setCategories}
        searchParams={searchParams}
      />

      <DataTable table={table}></DataTable>
    </>
  );
}

function TableFiltersWrapper({
  tierFilterOptions,
  tiers,
  setTiers,
  typeFilterOptions,
  types,
  setTypes,
  categoryFilterOptions,
  categories,
  setCategories,
}: {
  tierFilterOptions: { value: string; label: string }[];
  tiers: string[];
  setTiers: (value: string[]) => void;
  typeFilterOptions: { value: string; label: string }[];
  types: string[];
  setTypes: (value: string[]) => void;
  categoryFilterOptions: { value: string; label: string }[];
  categories: string[];
  setCategories: (value: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full sm:w-auto">Filters</Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-80">
          <TableFilters
            tierFilterOptions={tierFilterOptions}
            tiers={tiers}
            setTiers={setTiers}
            typeFilterOptions={typeFilterOptions}
            types={types}
            setTypes={setTypes}
            categoryFilterOptions={categoryFilterOptions}
            categories={categories}
            setCategories={setCategories}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full sm:w-auto">Filters</Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <TableFilters
          tierFilterOptions={tierFilterOptions}
          tiers={tiers}
          setTiers={setTiers}
          typeFilterOptions={typeFilterOptions}
          types={types}
          setTypes={setTypes}
          categoryFilterOptions={categoryFilterOptions}
          categories={categories}
          setCategories={setCategories}
        />
      </DrawerContent>
    </Drawer>
  );
}

export function TableFilters({
  tierFilterOptions,
  tiers,
  setTiers,
  typeFilterOptions,
  types,
  setTypes,
  categoryFilterOptions,
  categories,
  setCategories,
}: {
  tierFilterOptions: { value: string; label: string }[];
  tiers: string[];
  setTiers: (value: string[]) => void;
  typeFilterOptions: { value: string; label: string }[];
  types: string[];
  setTypes: (value: string[]) => void;
  categoryFilterOptions: { value: string; label: string }[];
  categories: string[];
  setCategories: (value: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="space-y-2">
          <span>Tiers</span>

          <MultiSelect
            value={tiers}
            onValueChange={(value) => {
              setTiers(value);
            }}
          >
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Select tiers" />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                {tierFilterOptions.map((option) => (
                  <MultiSelectItem key={option.value} value={option.value}>
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
            value={types}
            onValueChange={(value) => {
              setTypes(value);
            }}
          >
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Select types" />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                {typeFilterOptions.map((option) => (
                  <MultiSelectItem key={option.value} value={option.value}>
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
          <span>Categories</span>

          <MultiSelect
            value={categories}
            onValueChange={(value) => {
              setCategories(value);
            }}
          >
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Select categories" />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                {categoryFilterOptions.map((option) => (
                  <MultiSelectItem key={option.value} value={option.value}>
                    {option.label}
                  </MultiSelectItem>
                ))}
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
        </Label>
      </div>
    </div>
  );
}

function TableFilterStatus({
  search,
  setSearch,
  tiers,
  setTiers,
  types,
  setTypes,
  categories,
  setCategories,
  searchParams,
}: {
  search: string;
  setSearch: (value: string) => void;
  tiers: string[];
  setTiers: (value: string[]) => void;
  types: string[];
  setTypes: (value: string[]) => void;
  categories: string[];
  setCategories: (value: string[]) => void;
  searchParams: ReadonlyURLSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const filterByName = React.useMemo(() => Boolean(search.length), [search]);
  const filterByTier = React.useMemo(() => Boolean(tiers.length), [tiers]);
  const filterByType = React.useMemo(() => Boolean(types.length), [types]);
  const filterByCategory = React.useMemo(
    () => Boolean(categories?.length),
    [categories],
  );

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString(
        {
          search: search,
          tiers: tiers,
          types: types,
          categories: categories,
        },
        searchParams,
      )}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tiers, types, categories]);

  if (!filterByName && !filterByTier && !filterByType && !filterByCategory) {
    return null;
  }

  return (
    <div className="border-t border-border px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Active filters:</span>

        <div className="flex items-center gap-2">
          {filterByName && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setSearch("")}
            >
              <XCircleIcon className="h-4 w-4" />
              Search: {search}
            </Badge>
          )}
          {filterByTier && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setTiers([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Tiers: {formatArray(tiers)}
            </Badge>
          )}
          {filterByType && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setTypes([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Types: {formatArray(types)}
            </Badge>
          )}
          {filterByCategory && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setCategories([])}
            >
              <XCircleIcon className="h-4 w-4" />
              <span>Categories: {formatArray(categories)}</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
