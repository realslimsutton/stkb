"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  SortingState,
  type ColumnDef,
  type Table,
} from "@tanstack/react-table";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  FilterIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import TimeAgo from "react-timeago";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import {
  MarketItemsContext,
  type MarketItemsContextType,
} from "~/components/context/market-items-context";
import {
  MarketPricesContext,
  type MarketPricesContextType,
} from "~/components/context/market-prices-context";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
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
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import useDataTable from "~/hooks/use-data-table";
import useParsedSearchParams from "~/hooks/use-parsed-search-params";
import { capitalise, formatArray, formatNumber } from "~/lib/formatter";
import { cn, createQueryString, wrapArray } from "~/lib/utils";
import {
  blueprintTypes,
  gradeComparisons,
  itemGrades,
} from "~/shop-titans/data/enums";

type Record = MarketItemsContextType["items"][0];

const searchParamsSchema = z.object({
  search: z.string().optional().default("").catch(""),
  tiers: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
  types: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
  sort: z.string().or(z.array(z.string())).optional().default([]).catch([]),
  grades: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
});

export default function MarketGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParams(
    searchParams,
    searchParamsSchema,
  );

  const marketItemsContext = React.useContext(MarketItemsContext);
  const marketPricesContext = React.useContext(MarketPricesContext);

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
    [],
  );

  const gradeFilterOptions = React.useMemo(
    () =>
      Object.entries(itemGrades).map(([value, label]) => ({ label, value })),
    [],
  );

  const [search, setSearch] = React.useState(parsedSearchParams.search);
  const [tiers, setTiers] = React.useState(wrapArray(parsedSearchParams.tiers));
  const [types, setTypes] = React.useState(wrapArray(parsedSearchParams.types));
  const [sorting, setSorting] = React.useState<string[]>(
    wrapArray(parsedSearchParams.sort),
  );
  const [grades, setGrades] = React.useState<string[]>(
    wrapArray(parsedSearchParams.grades),
  );

  const columns = React.useMemo(
    () =>
      getTableColumns(
        marketPricesContext?.prices ??
          (new Map() as MarketPricesContextType["prices"]),
      ),
    [marketPricesContext],
  );

  const { table } = useDataTable({
    data: marketItemsContext?.items ?? [],
    columns,
    defaultPerPage: 12,
    disablePerPage: true,
    initialState: {
      columnFilters: [
        {
          id: "name",
          value: search,
        },
        {
          id: "tier",
          value: tiers,
        },
        {
          id: "type",
          value: types,
        },
        {
          id: "grade",
          value: grades,
        },
      ],
    },
  });

  const filterableColumns = React.useMemo(() => {
    return {
      name: table.getColumn("name")!,
      tier: table.getColumn("tier")!,
      type: table.getColumn("type")!,
      marketArbitrage: table.getColumn("marketArbitrage")!,
      shopArbitrage: table.getColumn("shopArbitrage")!,
      xp: table.getColumn("xp")!,
      craftXp: table.getColumn("craftXp")!,
      grade: table.getColumn("grade")!,
    };
  }, [table]);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    filterableColumns.name.setFilterValue(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumns, search]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }
    filterableColumns.tier.setFilterValue(tiers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumns, tiers]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    filterableColumns.type.setFilterValue(types);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumns, types]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    filterableColumns.type.setFilterValue(types);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumns, types]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    filterableColumns.grade.setFilterValue(grades);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumns, grades]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    const sortedColumns: SortingState = [];
    for (const sort of sorting) {
      const [columnName, direction] = sort.split(".");
      if (
        !columnName ||
        !direction ||
        sortedColumns.some((val) => val.id === columnName)
      ) {
        continue;
      }

      sortedColumns.push({
        id: columnName,
        desc: direction === "desc",
      });
    }

    console.log([sorting, sortedColumns]);

    table.setSorting(sortedColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    router.push(
      `${pathname}?${createQueryString(
        {
          search,
          tiers,
          types,
          grades,
        },
        searchParams,
      )}`,
      {
        scroll: false,
      },
    );

    if (table.getState().pagination.pageIndex !== 0) {
      table.setPageIndex(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tiers, types, grades]);

  if (
    marketItemsContext?.isLoadingItems ??
    marketPricesContext?.isLoadingPrices
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[74px]" />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-[307px]" />
          ))}
        </div>

        <Skeleton className="h-16" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MarketFilters
        table={table}
        search={search}
        setSearch={setSearch}
        tierFilterOptions={tierFilterOptions}
        tiers={tiers}
        setTiers={setTiers}
        typeFilterOptions={typeFilterOptions}
        types={types}
        setTypes={setTypes}
        sorting={sorting}
        setSorting={setSorting}
        gradeFilterOptions={gradeFilterOptions}
        grades={grades}
        setGrades={setGrades}
      />

      <MarketItemGrid
        table={table}
        marketDataPrices={marketPricesContext?.prices ?? new Map()}
      />

      <Card>
        <CardContent>
          <MarketGridPagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

function getTableColumns(
  prices: MarketPricesContextType["prices"],
): ColumnDef<Record>[] {
  return [
    {
      accessorKey: "image",
    },
    {
      accessorKey: "name",
    },
    {
      accessorKey: "type",
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue?.length === 0) {
          return true;
        }

        return filterValue.includes(row.original.type);
      },
    },
    {
      accessorKey: "tier",
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue?.length === 0) {
          return true;
        }

        return filterValue.includes(row.original.tier.toString());
      },
    },
    {
      accessorKey: "value",
    },
    {
      id: "marketArbitrage",
      sortUndefined: "last",
      accessorFn: (row) => {
        const item = prices.get(row.referenceId);
        if (!item) {
          return undefined;
        }

        if (!item.offer || !item.request) {
          return undefined;
        }

        if (item.offer.goldPrice === null || item.request.goldPrice === null) {
          return undefined;
        }

        return (item.request.goldPrice ?? 0) - (item.offer.goldPrice ?? 0);
      },
    },
    {
      id: "shopArbitrage",
      sortUndefined: "last",
      accessorFn: (row) => {
        const item = prices.get(row.referenceId);
        if (!item) {
          return undefined;
        }

        if (!item.offer || item.offer.goldQty === 0) {
          return undefined;
        }

        return row.value - (item.offer.goldPrice ?? 0);
      },
    },
    {
      id: "fusionArbitrage",
      sortUndefined: "last",
      accessorFn: (row) => {
        const item = prices.get(row.referenceId);
        if (!item) {
          return undefined;
        }

        const gradeComparison = gradeComparisons[
          row.grade
        ] as keyof typeof gradeComparisons;

        if (!gradeComparison) {
          return undefined;
        }

        const comparisonPrices = prices.get(`${row.uid}.${gradeComparison}`);

        if ((!item?.request && !item?.offer) || !comparisonPrices?.offer) {
          return null;
        }

        // Needs 5 items to fuse into a higher tier
        if (comparisonPrices.offer.gemsQty < 5) {
          return null;
        }

        const comparisonOfferPrice =
          (comparisonPrices.offer.gemsPrice ?? 0) * 5;

        return (
          (item?.request?.gemsPrice ?? item?.offer?.gemsPrice ?? 0) -
          comparisonOfferPrice
        );
      },
    },
    {
      accessorKey: "xp",
    },
    {
      accessorKey: "craftXp",
    },
    {
      accessorKey: "grade",
    },
  ];
}

function MarketFilters({
  table,
  search,
  setSearch,
  tierFilterOptions,
  tiers,
  setTiers,
  typeFilterOptions,
  types,
  setTypes,
  sorting,
  setSorting,
  gradeFilterOptions,
  grades,
  setGrades,
}: {
  table: Table<Record>;
  search: string;
  setSearch: (value: string) => void;
  tierFilterOptions: { value: string; label: string }[];
  tiers: string[];
  setTiers: (value: string[]) => void;
  typeFilterOptions: { value: string; label: string }[];
  types: string[];
  setTypes: (value: string[]) => void;
  sorting: string[];
  setSorting: (value: string[]) => void;
  gradeFilterOptions: { value: string; label: string }[];
  grades: string[];
  setGrades: (value: string[]) => void;
}) {
  return (
    <>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
            <MarketFiltersTrigger
              table={table}
              tierFilterOptions={tierFilterOptions}
              tiers={tiers}
              setTiers={setTiers}
              typeFilterOptions={typeFilterOptions}
              types={types}
              setTypes={setTypes}
              sorting={sorting}
              setSorting={setSorting}
              gradeFilterOptions={gradeFilterOptions}
              grades={grades}
              setGrades={setGrades}
            />
          </div>

          <ActiveFilters
            search={search}
            setSearch={setSearch}
            tiers={tiers}
            setTiers={setTiers}
            types={types}
            setTypes={setTypes}
            sorting={sorting}
            setSorting={setSorting}
            grades={grades}
            setGrades={setGrades}
          />
        </CardContent>
      </Card>
    </>
  );
}

function MarketFiltersTrigger({
  table,
  tierFilterOptions,
  tiers,
  setTiers,
  typeFilterOptions,
  types,
  setTypes,
  sorting,
  setSorting,
  gradeFilterOptions,
  grades,
  setGrades,
}: {
  table: Table<Record>;
  tierFilterOptions: { value: string; label: string }[];
  tiers: string[];
  setTiers: (value: string[]) => void;
  typeFilterOptions: { value: string; label: string }[];
  types: string[];
  setTypes: (value: string[]) => void;
  sorting: string[];
  setSorting: (value: string[]) => void;
  gradeFilterOptions: { value: string; label: string }[];
  grades: string[];
  setGrades: (value: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full sm:w-auto">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filter &amp; Sort
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-80">
          <MarketFiltersForm
            table={table}
            tierFilterOptions={tierFilterOptions}
            tiers={tiers}
            setTiers={setTiers}
            typeFilterOptions={typeFilterOptions}
            types={types}
            setTypes={setTypes}
            sorting={sorting}
            setSorting={setSorting}
            gradeFilterOptions={gradeFilterOptions}
            grades={grades}
            setGrades={setGrades}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full sm:w-auto">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-4 pb-6">
        <MarketFiltersForm
          table={table}
          tierFilterOptions={tierFilterOptions}
          tiers={tiers}
          setTiers={setTiers}
          typeFilterOptions={typeFilterOptions}
          types={types}
          setTypes={setTypes}
          sorting={sorting}
          setSorting={setSorting}
          gradeFilterOptions={gradeFilterOptions}
          grades={grades}
          setGrades={setGrades}
        />
      </DrawerContent>
    </Drawer>
  );
}

function MarketFiltersForm({
  table,
  tierFilterOptions,
  tiers,
  setTiers,
  typeFilterOptions,
  types,
  setTypes,
  sorting,
  setSorting,
  gradeFilterOptions,
  grades,
  setGrades,
}: {
  table: Table<Record>;
  tierFilterOptions: { value: string; label: string }[];
  tiers: string[];
  setTiers: (value: string[]) => void;
  typeFilterOptions: { value: string; label: string }[];
  types: string[];
  setTypes: (value: string[]) => void;
  sorting: string[];
  setSorting: (value: string[]) => void;
  gradeFilterOptions: { value: string; label: string }[];
  grades: string[];
  setGrades: (value: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="space-y-2">
          <span>Sort</span>

          <MultiSelect value={sorting} onValueChange={setSorting}>
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Sort items..." />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                <MultiSelectGroup heading="Name">
                  <MultiSelectItem label="Name: ASC" value="name.asc">
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem label="Name: DESC" value="name.desc">
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Value">
                  <MultiSelectItem label="Value: ASC" value="value.asc">
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem label="Value: DESC" value="value.desc">
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Tier">
                  <MultiSelectItem label="Tier: ASC" value="tier.asc">
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem label="Tier: DESC" value="tier.desc">
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Shop Arbitrage">
                  <MultiSelectItem
                    label="Shop Arbitrage: ASC"
                    value="shopArbitrage.asc"
                  >
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem
                    label="Shop Arbitrage: DESC"
                    value="shopArbitrage.desc"
                  >
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Market Arbitrage">
                  <MultiSelectItem
                    label="Market Arbitrage: ASC"
                    value="marketArbitrage.asc"
                  >
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem
                    label="Market Arbitrage: DESC"
                    value="marketArbitrage.desc"
                  >
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Fusion Arbitrage">
                  <MultiSelectItem
                    label="Fusion Arbitrage: ASC"
                    value="fusionArbitrage.asc"
                  >
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem
                    label="Fusion Arbitrage: DESC"
                    value="fusionArbitrage.desc"
                  >
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Merchant XP">
                  <MultiSelectItem label="Merchant XP: ASC" value="xp.asc">
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem label="Merchant XP: DESC" value="xp.desc">
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>

                <MultiSelectGroup heading="Worker XP">
                  <MultiSelectItem label="Worker XP: ASC" value="craftXp.asc">
                    Ascending
                  </MultiSelectItem>
                  <MultiSelectItem label="Worker XP: DESC" value="craftXp.desc">
                    Descending
                  </MultiSelectItem>
                </MultiSelectGroup>
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
        </Label>
      </div>

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
          <span>Quality</span>

          <MultiSelect
            value={grades}
            onValueChange={(value) => {
              setGrades(value);
            }}
          >
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Select qualities" />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                {gradeFilterOptions.map((option) => (
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

function ActiveFilters({
  search,
  setSearch,
  tiers,
  setTiers,
  types,
  setTypes,
  sorting,
  setSorting,
  grades,
  setGrades,
}: {
  search: string;
  setSearch: (value: string) => void;
  tiers: string[];
  setTiers: (value: string[]) => void;
  types: string[];
  setTypes: (value: string[]) => void;
  sorting: string[];
  setSorting: (value: string[]) => void;
  grades: string[];
  setGrades: (value: string[]) => void;
}) {
  const isFilteringByName = React.useMemo(
    () => Boolean(search.length),
    [search],
  );
  const isFilteringByTier = React.useMemo(() => Boolean(tiers.length), [tiers]);
  const isFilteringByType = React.useMemo(() => Boolean(types.length), [types]);
  const isFilteringByQuality = React.useMemo(
    () => Boolean(grades.length),
    [grades],
  );
  const isSorting = React.useMemo(() => Boolean(sorting.length), [sorting]);

  if (
    !isFilteringByName &&
    !isFilteringByTier &&
    !isFilteringByType &&
    !isFilteringByQuality &&
    !isSorting
  ) {
    return null;
  }

  return (
    <div className="sm:col-span-2">
      <div className="space-y-1">
        <p className="text-sm font-medium">Active filters:</p>

        <div className="flex items-center gap-2">
          {isFilteringByName && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setSearch("")}
            >
              <XCircleIcon className="h-4 w-4" />
              Search: {search}
            </Badge>
          )}
          {isFilteringByTier && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setTiers([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Tiers: {formatArray(tiers)}
            </Badge>
          )}
          {isFilteringByType && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setTypes([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Types: {formatArray(types)}
            </Badge>
          )}
          {isFilteringByQuality && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setGrades([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Qualities: {formatArray(grades)}
            </Badge>
          )}

          {isSorting &&
            sorting.map((sort) => {
              const [column, direction] = sort.split(".");

              return (
                <Badge
                  className="flex cursor-pointer items-center gap-1"
                  onClick={() =>
                    setSorting(sorting.filter((val) => val !== sort))
                  }
                  key={sort}
                >
                  <XCircleIcon className="h-4 w-4" />
                  {capitalise(column)}:{" "}
                  {direction === "asc" ? "Ascending" : "Descending"}
                </Badge>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function MarketItemGrid({
  table,
  marketDataPrices,
}: {
  table: Table<Record>;
  marketDataPrices: MarketPricesContextType["prices"];
}) {
  const rows = table.getRowModel().rows;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {rows?.length ? (
        rows.map((row) => {
          return (
            <MarketGridItem
              key={row.id}
              item={row.original}
              marketDataPrices={marketDataPrices}
            />
          );
        })
      ) : (
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
          No results found.
        </div>
      )}
    </div>
  );
}

function MarketGridItem({
  item,
  marketDataPrices,
}: {
  item: Record;
  marketDataPrices: MarketPricesContextType["prices"];
}) {
  const prices = React.useMemo(
    () => marketDataPrices.get(item.referenceId),
    [item.referenceId, marketDataPrices],
  );
  const comparisonPrices = React.useMemo(() => {
    const gradeComparison = gradeComparisons[
      item.grade
    ] as keyof typeof gradeComparisons;

    if (!gradeComparison) {
      return undefined;
    }

    return marketDataPrices.get(`${item.uid}.${gradeComparison}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeComparisons, item.grade, marketDataPrices]);

  const shopArbitrage = React.useMemo(() => {
    if (!prices?.offer || prices.offer.goldQty === 0) {
      return null;
    }

    return item.value - (prices.offer.goldPrice ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  const marketArbitrage = React.useMemo(() => {
    if (!prices?.offer || !prices?.request) {
      return null;
    }

    if (prices.offer.goldPrice === null || prices.request.goldPrice === null) {
      return null;
    }

    return (prices.request.goldPrice ?? item.value) - prices.offer.goldPrice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  const fusionArbitrage = React.useMemo(() => {
    if ((!prices?.request && !prices?.offer) || !comparisonPrices?.offer) {
      return null;
    }

    // Needs 5 items to fuse into a higher tier
    if (comparisonPrices.offer.gemsQty < 5) {
      return null;
    }

    const comparisonOfferPrice = (comparisonPrices.offer.gemsPrice ?? 0) * 5;

    return (
      (prices?.request?.gemsPrice ?? prices?.offer?.gemsPrice ?? 0) -
      comparisonOfferPrice
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonPrices]);

  const updatedAt = React.useMemo(() => {
    if (!prices?.offer?.updatedAt && !prices?.request?.updatedAt) {
      return new Date();
    }

    if (!prices?.offer?.updatedAt && prices?.request?.updatedAt) {
      return prices.request.updatedAt;
    }

    if (prices?.offer?.updatedAt && !prices?.request?.updatedAt) {
      return prices.offer.updatedAt;
    }

    return prices.offer!.updatedAt > prices.request!.updatedAt
      ? prices.offer!.updatedAt
      : prices.request!.updatedAt;
  }, [prices]);

  return (
    <Card className="relative">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold">{item.name}</div>
            <div className="text-xs text-muted-foreground">
              Tier {item.tier} {capitalise(item.grade ?? "normal")}{" "}
              {item.typeName}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="p-0">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`https://playshoptitans.com/blueprints/${item.category}/${item.type}/${item.uid}`}
                  target="_blank"
                  className="flex cursor-pointer items-center gap-1"
                >
                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                  <span>View Blueprint</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid w-full grid-cols-2 gap-2">
          <div>
            <Image
              src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/items/${item.uid}.webp`}
              alt={item.name}
              height={100}
              width={100}
              className={cn({
                "filter-superior": item.grade === "superior",
                "filter-flawless": item.grade === "flawless",
                "filter-epic": item.grade === "epic",
                "filter-legendary": item.grade === "legendary",
              })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <Image
                src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/gold.webp"
                height={25}
                width={25}
                alt="Gold"
                title="Gold"
              />

              {formatNumber(item.value)}
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <Image
                src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/merchant_experience.webp"
                height={25}
                width={25}
                alt="Merchant XP"
                title="Merchant XP"
                className="aspect-square"
              />

              {formatNumber(item.xp)}
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <Image
                src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/worker_experience.webp"
                height={25}
                width={25}
                alt="Worker XP"
                title="Worker XP"
                className="aspect-square"
              />

              {formatNumber(item.craftXp)}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold">Market Information</h3>
            <p className="text-xs font-medium text-muted-foreground">
              Updated <TimeAgo date={updatedAt} />
            </p>
          </div>

          <p className="flex items-center justify-between text-xs">
            <span className="font-medium">Shop Arbitrage:</span>

            <span className="flex items-center gap-1">
              {shopArbitrage !== null ? (
                <>
                  <Image
                    src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/gold.webp"
                    height={20}
                    width={20}
                    alt="Gold"
                    title="Gold"
                  />
                  {formatNumber(shopArbitrage, true, false, true)}
                </>
              ) : (
                "-"
              )}
            </span>
          </p>

          <p className="flex items-center justify-between text-xs">
            <span className="font-medium">Market Arbitrage:</span>

            <span className="flex items-center gap-1">
              {marketArbitrage !== null ? (
                <>
                  <Image
                    src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/gold.webp"
                    height={20}
                    width={20}
                    alt="Gold"
                    title="Gold"
                  />
                  {formatNumber(marketArbitrage, true, false, true)}
                </>
              ) : (
                "-"
              )}
            </span>
          </p>

          <p className="flex items-center justify-between text-xs">
            <span className="font-medium">Fusion Arbitrage:</span>

            <span className="flex items-center gap-1">
              {fusionArbitrage !== null ? (
                <>
                  <Image
                    src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/icons/gem.webp"
                    height={20}
                    width={20}
                    alt="Gem"
                    title="Gem"
                  />
                  {formatNumber(fusionArbitrage, true, false, true)}
                </>
              ) : (
                "-"
              )}
            </span>
          </p>

          <p className="flex items-center justify-between text-xs">
            <span className="font-medium">Offer Quantity:</span>

            <span className="flex items-center gap-1">
              {formatNumber(prices?.offer?.goldQty ?? 0)} (
              {formatNumber(prices?.offer?.gemsQty ?? 0)})
            </span>
          </p>

          <p className="flex items-center justify-between text-xs">
            <span className="font-medium">Request Quantity:</span>

            <span className="flex items-center gap-1">
              {formatNumber(prices?.request?.goldQty ?? 0)} (
              {formatNumber(prices?.request?.gemsQty ?? 0)})
            </span>
          </p>

          <sup className="flex w-full items-center justify-end text-right text-xs text-muted-foreground">
            Gold (Gem)
          </sup>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketGridPagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 overflow-auto sm:gap-8">
      <div className="whitespace-nowrap text-sm text-foreground">
        Showing{" "}
        <span className="font-semibold">
          {formatNumber(
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1,
          )}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {formatNumber(
            Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowCount(),
            ),
          )}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {formatNumber(table.getRowCount())}
        </span>{" "}
        entries
      </div>

      <div className="flex items-center space-x-2">
        <Button
          aria-label="Go to first page"
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
