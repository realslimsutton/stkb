import * as React from "react";
import { db } from "~/server/db";
import PageHeader from "../_components/page-header";
import MarketTable from "./_components/market-table";
import { DataTableSkeleton } from "~/components/ui/datatable/skeleton";

export const metadata = {
  title: "Market | Shop Titans Knowledge Base",
};

export default async function MarketPage() {
  const dataLoader = db.query.blueprints.findMany();

  return (
    <>
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
      <div className="absolute hidden h-full w-full bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:block"></div>

      <div className="relative">
        <PageHeader>Market</PageHeader>

        <div className="container relative mx-auto">
          <div className="w-full rounded-lg border bg-background shadow-xl">
            <React.Suspense fallback={<DataTableSkeleton columnCount={5} />}>
              <MarketTable dataLoader={dataLoader} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
