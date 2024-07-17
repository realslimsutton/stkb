"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type InitialTableState,
  type OnChangeFn,
  useReactTable,
  type VisibilityState,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { useParsedSearchParams } from "~/hooks/use-parsed-search-params";
import { createQueryString } from "~/lib/utils";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  defaultPerPage?: number;
  disablePerPage?: boolean;
  defaultSort?: `${Extract<keyof TData, string | number>}.${"asc" | "desc"}`;
  initialState?: InitialTableState;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: OnChangeFn<VisibilityState>;
}

const searchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1).catch(1),
  perPage: z.coerce.number().optional().catch(10),
  sort: z.string().or(z.array(z.string())).optional().catch(undefined),
});

export default function useDataTable<TData, TValue>({
  data,
  columns,
  defaultPerPage = 10,
  disablePerPage = false,
  defaultSort,
  columnVisibility,
  setColumnVisibility,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedSearchParams = useParsedSearchParams(
    searchParams,
    searchParamsSchema,
  );

  const page = parsedSearchParams.page;
  const perPage = disablePerPage
    ? defaultPerPage
    : parsedSearchParams.perPage ?? defaultPerPage;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Math.max(page - 1, 0),
    pageSize: perPage,
  });

  const sortedColumns = getSortedColumns(
    parsedSearchParams.sort ?? defaultSort,
  );
  const [sorting, setSorting] = React.useState<SortingState>(sortedColumns);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString(
        {
          page: pagination.pageIndex + 1,
          perPage: !disablePerPage ? pagination.pageSize : undefined,
          sort: sorting
            .map((sort) => {
              return sort?.id
                ? `${sort?.id}.${sort?.desc ? "desc" : "asc"}`
                : null;
            })
            .filter((x) => x !== null),
        },
        searchParams,
      )}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return { table };
}

function getSortedColumns(columns: string | string[] | undefined) {
  if (!columns) {
    return [];
  }

  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const [id, desc] = column.split(".");
      return {
        id: id ?? "",
        desc: desc === "desc",
      };
    });
  }

  const [id, desc] = columns.split(".");
  return [
    {
      id: id ?? "",
      desc: desc === "desc",
    },
  ];
}
