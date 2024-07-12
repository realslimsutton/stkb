"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { HeroesContext } from "~/components/context/heroes-context";
import Avatar from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/datatable";
import { DataTableColumnHeader } from "~/components/ui/datatable/column-header";
import { DataTableSkeleton } from "~/components/ui/datatable/skeleton";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from "~/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import useDataTable from "~/hooks/use-data-table";
import useParsedSearchParams from "~/hooks/use-parsed-search-params";
import { capitalise, formatArray, formatNumber } from "~/lib/formatter";
import { cn, createQueryString, getItemIcon, wrapArray } from "~/lib/utils";
import {
  heroBaseClasses,
  heroClasses,
  heroSkillQualities,
} from "~/shop-titans/data/enums";
import { type Adventurer } from "~/types";

type Record = Adventurer;

const columns: ColumnDef<Record>[] = [
  {
    id: "image",
    header: () => null,
    cell: ({ row }) => (
      <Avatar
        src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/heroes/${row.original.cls}.webp`}
        alt={row.original.name}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "cls",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => <>{capitalise(row.original.cls)}</>,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue?.length === 0) {
        return true;
      }

      return filterValue.includes(row.original.cls);
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => <>{formatNumber(row.original.level)}</>,
  },
  {
    id: "skills",
    header: "Skills",
    accessorFn: (row) => {
      return [row.skl1, row.skl2, row.skl3];
    },
    cell: ({ row, getValue }) => {
      const skills = getValue() as (string | null)[];

      return (
        <span className="flex items-center gap-2">
          {skills.map((skill, index) => {
            if (!skill) {
              return null;
            }

            return (
              <SkillIcon
                key={`${index}-${skill}`}
                skill={skill}
                className={row.original.cls}
              />
            );
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-2">
          {row.original.items.map((item, index) => {
            const grade = item.tag1 ?? "common";
            const iconUrl = getItemIcon(item.uid);

            return (
              <div
                key={`${index}-${item.id}`}
                className="relative flex flex-col items-center justify-center"
              >
                <Avatar
                  src={iconUrl}
                  alt={item.uid}
                  className={cn({
                    "filter-superior": grade === "superior",
                    "filter-flawless": grade === "flawless",
                    "filter-epic": grade === "epic",
                    "filter-legendary": grade === "legendary",
                  })}
                />
              </div>
            );
          })}
        </span>
      );
    },
  },
];

const searchParamsSchema = z.object({
  search: z.string().optional().default("").catch(""),
  classes: z.array(z.string()).or(z.string()).optional().default([]).catch([]),
});

export default function HeroTable() {
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParams(
    searchParams,
    searchParamsSchema,
  );

  const { heroes, isLoadingHeroes, refreshHeroes } =
    React.useContext(HeroesContext)!;

  const classFilterOptions = React.useMemo(
    () => ({
      fighters: Object.entries(heroClasses.fighters).map(([key, value]) => ({
        value: key,
        label: value,
      })),
      rogues: Object.entries(heroClasses.rogues).map(([key, value]) => ({
        value: key,
        label: value,
      })),
      spellcasters: Object.entries(heroClasses.spellcasters).map(
        ([key, value]) => ({
          value: key,
          label: value,
        }),
      ),
    }),
    [],
  );

  const [search, setSearch] = React.useState(parsedSearchParams.search);
  const [classes, setClasses] = React.useState(
    wrapArray(parsedSearchParams.classes),
  );

  React.useEffect(() => {
    if (heroes) {
      return;
    }

    if (!isLoadingHeroes && !heroes) {
      toast.error("Failed to load heroes", {
        description: "Please try again later.",
      });
    }
  }, [heroes, isLoadingHeroes]);

  const { table } = useDataTable({
    data: heroes ?? [],
    columns,
    defaultPerPage: 10,
  });

  const filterableColumns = React.useMemo(() => {
    return {
      name: table.getColumn("name")!,
      class: table.getColumn("cls")!,
    };
  }, [table]);

  React.useEffect(() => {
    filterableColumns.name.setFilterValue(search);
  }, [filterableColumns, search]);

  React.useEffect(() => {
    filterableColumns.class.setFilterValue(classes);
  }, [filterableColumns, classes]);

  if (isLoadingHeroes || !heroes) {
    return <DataTableSkeleton columnCount={5} />;
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

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={async () => await refreshHeroes()}
          >
            Refresh
          </Button>

          <TableFiltersWrapper
            classFilterOptions={classFilterOptions}
            classes={classes}
            setClasses={setClasses}
          />
        </div>
      </div>

      <TableFilterStatus
        search={search}
        setSearch={setSearch}
        classes={classes}
        setClasses={setClasses}
        searchParams={searchParams}
      />

      <DataTable table={table}></DataTable>
    </>
  );
}

function SkillIcon({ className, skill }: { className: string; skill: string }) {
  const url = `https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/skills/heroes/${skill}.webp`;

  const baseClass = heroBaseClasses[className as keyof typeof heroBaseClasses];
  if (!baseClass) {
    return <Avatar src={url} alt={skill} />;
  }

  const qualities =
    heroSkillQualities[baseClass as keyof typeof heroSkillQualities];
  if (!qualities) {
    return <Avatar src={url} alt={skill} />;
  }

  const quality = qualities[skill as keyof typeof qualities];
  if (!quality) {
    return <Avatar src={url} alt={skill} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <Avatar src={url} alt={skill} />

      <Image
        src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/quality-faces/icon_${quality}.webp`}
        height="20"
        width="20"
        alt={skill}
      />
    </div>
  );
}

function TableFiltersWrapper({
  classFilterOptions,
  classes,
  setClasses,
}: {
  classFilterOptions: {
    fighters: { value: string; label: string }[];
    rogues: { value: string; label: string }[];
    spellcasters: { value: string; label: string }[];
  };
  classes: string[];
  setClasses: (value: string[]) => void;
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
            classFilterOptions={classFilterOptions}
            classes={classes}
            setClasses={setClasses}
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
          classFilterOptions={classFilterOptions}
          classes={classes}
          setClasses={setClasses}
        />
      </DrawerContent>
    </Drawer>
  );
}

export function TableFilters({
  classFilterOptions,
  classes,
  setClasses,
}: {
  classFilterOptions: {
    fighters: { value: string; label: string }[];
    rogues: { value: string; label: string }[];
    spellcasters: { value: string; label: string }[];
  };
  classes: string[];
  setClasses: (value: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="space-y-2">
          <span>Classes</span>

          <MultiSelect
            value={classes}
            onValueChange={(value) => {
              setClasses(value);
            }}
          >
            <MultiSelectTrigger>
              <MultiSelectValue placeholder="Select classes" />
            </MultiSelectTrigger>

            <MultiSelectContent>
              <MultiSelectSearch />

              <MultiSelectList>
                <MultiSelectGroup heading="Fighters">
                  {classFilterOptions.fighters.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>

                <MultiSelectSeparator />

                <MultiSelectGroup heading="Rogues">
                  {classFilterOptions.rogues.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>

                <MultiSelectSeparator />

                <MultiSelectGroup heading="Spellcasters">
                  {classFilterOptions.spellcasters.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
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
  classes,
  setClasses,
  searchParams,
}: {
  search: string;
  setSearch: (value: string) => void;
  classes: string[];
  setClasses: (value: string[]) => void;
  searchParams: ReadonlyURLSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const filterByName = React.useMemo(() => Boolean(search.length), [search]);
  const filterByClasses = React.useMemo(
    () => Boolean(classes.length),
    [classes],
  );

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString(
        {
          search,
          classes,
        },
        searchParams,
      )}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, classes]);

  if (!filterByName && !filterByClasses) {
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
          {filterByClasses && (
            <Badge
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setClasses([])}
            >
              <XCircleIcon className="h-4 w-4" />
              Classes: {formatArray(classes)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
