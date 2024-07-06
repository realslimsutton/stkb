"use client";

import { ColumnDef } from "@tanstack/react-table";
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

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon, MoreHorizontal, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTableSkeleton } from "~/components/ui/datatable/skeleton";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
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
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import useParsedSearchParams from "~/hooks/use-parsed-search-params";
import { createQueryString, wrapArray } from "~/lib/utils";
import { BlueprintMarketData } from "~/shop-titans/types";

type Record = InferSelectModel<typeof blueprints>;

const searchParamsSchema = z.object({
  search: z.string().optional().default("").catch(""),
  tiers: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
  types: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
  categories: z
    .array(z.string())
    .or(z.string())
    .optional()
    .default([])
    .catch([]),
  showMarketColumns: z
    .string()
    .toLowerCase()
    .transform((x) => x === "true")
    .pipe(z.boolean())
    .optional()
    .catch(false),
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

  const [search, setSearch] = React.useState(parsedSearchParams.search);
  const [tiers, setTiers] = React.useState(wrapArray(parsedSearchParams.tiers));
  const [types, setTypes] = React.useState(wrapArray(parsedSearchParams.types));
  const [categories, setCategories] = React.useState(
    wrapArray(parsedSearchParams.categories),
  );
  const [showMarketColumns, setShowMarketColumns] = React.useState(
    parsedSearchParams.showMarketColumns ?? false,
  );

  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market.marketData", showMarketColumns],
    refetchInterval: 330000,
    queryFn: async () => await fetchMarketData(showMarketColumns),
  });

  const columns: ColumnDef<Record>[] = React.useMemo(
    () => [
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
          <>
            {blueprintTypes[row.original.type as keyof typeof blueprintTypes]}
          </>
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
          <DataTableColumnHeader column={column} title="Base Value" />
        ),
        cell: ({ row }) => (
          <span className="flex items-center gap-1">
            <Image
              src="/images/icon_gold.webp"
              alt="Gold"
              height="20"
              width="20"
            />
            {formatNumber(row.original.value)}
          </span>
        ),
      },
      {
        id: "marketArbitrage",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Market Arbitrage" />
        ),
        accessorFn: (row) => {
          if (!marketData) {
            return "-";
          }

          const item = marketData.get(row.id);
          if (!item) {
            return "-";
          }

          if (!item.offer || !item.request) {
            return "-";
          }

          return item.request.goldPrice - item.offer.goldPrice;
        },
        cell: ({ row, getValue }) => {
          const value = getValue();
          if (!value) {
            return "-";
          }

          const item = marketData?.get(row.original.id);
          if (!item?.offer || !item?.request) {
            return formatNumber(getValue() as number | null);
          }

          return (
            <>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <span>{formatNumber(value as number | null)}</span>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>

                <TooltipContent className="space-y-2">
                  {item?.offer && item?.request && (
                    <>
                      <p>
                        <span className="font-medium">Request Quantity:</span>{" "}
                        {formatNumber(item?.request.goldQty)}
                      </p>
                      <p>
                        <span className="font-medium">Offer Quantity:</span>{" "}
                        {formatNumber(item?.offer.goldQty)}
                      </p>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            </>
          );
        },
      },
      {
        id: "shopArbitrage",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Shop Arbitrage" />
        ),
        accessorFn: (row) => {
          if (!marketData) {
            return null;
          }

          const item = marketData.get(row.id);
          if (!item) {
            return null;
          }

          if (!item.request) {
            return null;
          }

          return row.value - item.request.goldPrice;
        },
        cell: ({ row, getValue }) => {
          const value = getValue();
          if (!value) {
            return "-";
          }

          const item = marketData?.get(row.original.id);
          if (!item?.request) {
            return formatNumber(getValue() as number | null);
          }

          return (
            <>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <span>{formatNumber(value as number | null)}</span>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>

                <TooltipContent className="space-y-2">
                  {item?.request && (
                    <>
                      <p>
                        <span className="font-medium">Request Quantity:</span>{" "}
                        {formatNumber(item?.request.goldQty)}
                      </p>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            </>
          );
        },
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
    ],
    [marketData],
  );

  const { table } = useDataTable({
    data,
    columns,
    defaultPerPage: 10,
    columnVisibility: {
      category: false,
      marketArbitrage: showMarketColumns,
      shopArbitrage: showMarketColumns,
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
      marketArbitrage: table.getColumn("marketArbitrage")!,
      shopArbitrage: table.getColumn("shopArbitrage")!,
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

  React.useEffect(() => {
    filterableColumns.marketArbitrage.toggleVisibility(showMarketColumns);
    filterableColumns.shopArbitrage.toggleVisibility(showMarketColumns);
  }, [showMarketColumns]);

  if (showMarketColumns && isLoading) {
    return (
      <div className="w-full rounded-lg border bg-background shadow-xl">
        <DataTableSkeleton columnCount={5} />
      </div>
    );
  }

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
            showMarketColumns={showMarketColumns}
            setShowMarketColumns={setShowMarketColumns}
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
        showMarketColumns={showMarketColumns}
        searchParams={searchParams}
      />

      <DataTable table={table}></DataTable>
    </>
  );
}

async function fetchMarketData(showMarketColumns: boolean) {
  if (!showMarketColumns) {
    return null;
  }

  const response = await fetch("https://smartytitans.com/api/item/last/all", {
    cache: "no-store",
  });

  const data = (await response.json()).data as BlueprintMarketData[];

  if (!data) {
    return null;
  }

  const keyedData = new Map<
    string,
    {
      offer?: {
        goldPrice: number;
        goldQty: number;
        gemsPrice: number;
        gemsQty: number;
        createdAt: Date;
      };
      request?: {
        goldPrice: number;
        goldQty: number;
        gemsPrice: number;
        gemsQty: number;
        createdAt: Date;
      };
    }
  >();

  for (const item of data) {
    if (item.tag1 !== null) {
      continue;
    }

    const entry = keyedData.get(item.uid);
    const createdAt = new Date(item.createdAt);

    if (!entry) {
      switch (item.tType) {
        case "o":
          keyedData.set(item.uid, {
            offer: {
              goldPrice: item.goldPrice,
              goldQty: item.goldQty,
              gemsPrice: item.gemsPrice,
              gemsQty: item.gemsQty,
              createdAt,
            },
          });
          break;
        case "r":
          keyedData.set(item.uid, {
            request: {
              goldPrice: item.goldPrice,
              goldQty: item.goldQty,
              gemsPrice: item.gemsPrice,
              gemsQty: item.gemsQty,
              createdAt,
            },
          });
          break;
      }

      continue;
    }

    switch (item.tType) {
      case "o":
        if (!entry.offer || createdAt > entry.offer.createdAt) {
          entry.offer = {
            goldPrice: item.goldPrice,
            goldQty: item.goldQty,
            gemsPrice: item.gemsPrice,
            gemsQty: item.gemsQty,
            createdAt,
          };
        }
        break;
      case "r":
        if (!entry.request || createdAt > entry.request.createdAt) {
          entry.request = {
            goldPrice: item.goldPrice,
            goldQty: item.goldQty,
            gemsPrice: item.gemsPrice,
            gemsQty: item.gemsQty,
            createdAt,
          };
        }
        break;
    }
  }

  return keyedData;
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
  showMarketColumns,
  setShowMarketColumns,
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
  showMarketColumns: boolean;
  setShowMarketColumns: (value: boolean) => void;
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
            showMarketColumns={showMarketColumns}
            setShowMarketColumns={setShowMarketColumns}
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
          showMarketColumns={showMarketColumns}
          setShowMarketColumns={setShowMarketColumns}
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
  showMarketColumns,
  setShowMarketColumns,
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
  showMarketColumns: boolean;
  setShowMarketColumns: (value: boolean) => void;
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

      <div>
        <Label className="flex items-center gap-2">
          <Switch
            checked={showMarketColumns}
            onCheckedChange={setShowMarketColumns}
          />
          Show market columns
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
  showMarketColumns,
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
  showMarketColumns: boolean;
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
          search,
          tiers,
          types,
          categories,
          showMarketColumns,
        },
        searchParams,
      )}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tiers, types, categories, showMarketColumns]);

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
