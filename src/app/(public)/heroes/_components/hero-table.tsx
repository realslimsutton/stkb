"use client";

import * as React from "react";
import { HeroContext } from "./hero-context";
import Image from "next/image";
import { DataTableSkeleton } from "~/components/ui/datatable/skeleton";
import { toast } from "sonner";
import { Adventurer } from "~/types";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "~/components/ui/avatar";
import { DataTableColumnHeader } from "~/components/ui/datatable/column-header";
import useDataTable from "~/hooks/use-data-table";
import { DataTable } from "~/components/ui/datatable";
import { capitalise, formatNumber } from "~/lib/formatter";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import useParsedSearchParams from "~/hooks/use-parsed-search-params";
import { InferSelectModel } from "drizzle-orm";
import { blueprints } from "~/server/db/schema";
import { heroBaseClasses, heroSkillQualities } from "~/shop-titans/data/enums";

interface Record extends Omit<Adventurer, "items"> {
  items: (InferSelectModel<typeof blueprints> & { tag1: string | null })[];
}

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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <>{capitalise(row.original.cls)}</>,
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
                index={index}
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
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        {row.original.items.map((item, index) => {
          const quality = item.tag1 ?? "common";

          return (
            <div
              key={`${index}-${item.id}`}
              className="relative flex flex-col items-center justify-center"
            >
              <Avatar src={item.image} alt={item.name} />

              <Image
                src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/quality-indicators/icon_${quality}.webp`}
                height="20"
                width="20"
                alt={item.name}
              />
            </div>
          );
        })}
      </span>
    ),
  },
];

const searchParamsSchema = z.object({
  search: z.string().optional().default("").catch(""),
  class: z.array(z.string()).optional().default([]).catch([]),
});

export default function HeroTable() {
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParams(
    searchParams,
    searchParamsSchema,
  );

  const { isLoading, heroes, refreshHeroes } = React.useContext(HeroContext)!;

  const [search, setSearch] = React.useState(parsedSearchParams.search);

  React.useEffect(() => {
    if (heroes) {
      return;
    }

    if (!isLoading && !heroes) {
      toast.error("Failed to load heroes", {
        description: "Please try again later.",
      });
    }
  }, [heroes, isLoading]);

  const { table } = useDataTable({
    data: heroes ?? [],
    columns,
    defaultPerPage: 10,
  });

  const filterableColumns = React.useMemo(() => {
    return {
      name: table.getColumn("name")!,
    };
  }, [table]);

  React.useEffect(() => {
    filterableColumns.name.setFilterValue(search);
  }, [filterableColumns, search]);

  if (isLoading || !heroes) {
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

        <div className="flex items-center justify-end gap-4">
          <Button
            variant="secondary"
            onClick={async () => await refreshHeroes()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <DataTable table={table}></DataTable>
    </>
  );
}

function SkillIcon({
  index,
  className,
  skill,
}: {
  index: number;
  className: string;
  skill: string;
}) {
  const url = `https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/skills/heroes/${skill}.webp`;

  const baseClass = heroBaseClasses[className as keyof typeof heroBaseClasses];
  if (!baseClass) {
    return <Avatar key={`${index}-${skill}`} src={url} alt={skill} />;
  }

  const qualities =
    heroSkillQualities[baseClass as keyof typeof heroSkillQualities];
  if (!qualities) {
    return <Avatar key={`${index}-${skill}`} src={url} alt={skill} />;
  }

  const quality = qualities[skill as keyof typeof qualities];
  if (!quality) {
    return <Avatar key={`${index}-${skill}`} src={url} alt={skill} />;
  }

  return (
    <div
      key={`${index}-${skill}`}
      className="relative flex flex-col items-center justify-center"
    >
      <Avatar src={url} alt={skill} />

      <Image
        src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/quality-faces/icon_${quality}.webp`}
        height="20"
        width="20"
        alt={skill}
      />
    </div>
  );

  return <Avatar key={`${index}-${skill}`} src={url} alt={skill} />;
}
