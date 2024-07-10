import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";
import { ListRestart } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? "Sorted descending. Click to sort ascending."
                : column.getIsSorted() === "asc"
                  ? "Sorted ascending. Click to sort descending."
                  : "Not sorted. Click to sort ascending."
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 px-4 py-0 font-semibold hover:bg-muted/40 data-[state=open]:bg-muted/40 lg:py-4"
          >
            <span>{title}</span>
            {column.getCanSort() && column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuLabel>Sorting</DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={
                  column.getIsSorted() ? (column.getIsSorted() as string) : ""
                }
              >
                <DropdownMenuRadioItem
                  value="asc"
                  aria-label="Sort ascending"
                  onClick={() =>
                    column.getIsSorted() !== "asc"
                      ? column.toggleSorting(false, column.getCanMultiSort())
                      : column.clearSorting()
                  }
                >
                  <ArrowUpIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Ascending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="desc"
                  aria-label="Sort descending"
                  onClick={() =>
                    column.getIsSorted() !== "desc"
                      ? column.toggleSorting(true, column.getCanMultiSort())
                      : column.clearSorting()
                  }
                >
                  <ArrowDownIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Descending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </>
          )}
          {column.getIsSorted() && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                aria-label="Reset column"
                onClick={() => column.clearSorting()}
              >
                <ListRestart
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Reset column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
