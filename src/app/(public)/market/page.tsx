import * as React from "react";
import { MarketItemsProvider } from "~/components/context/market-items-context";
import { MarketPricesProvider } from "~/components/context/market-prices-context";
import PageHeader from "../_components/page-header";
import MarketGrid from "./_components/market-grid";

export const metadata = {
  title: "Market | Shop Titans Knowledge Base",
};

export default async function MarketPage() {
  const isDev = false; //env.NODE_ENV === "development";

  return (
    <>
      <PageHeader>Market</PageHeader>

      <div className="container mx-auto">
        <MarketItemsProvider>
          <MarketPricesProvider debug={isDev}>
            <React.Suspense>
              <MarketGrid />
            </React.Suspense>
          </MarketPricesProvider>
        </MarketItemsProvider>
      </div>
    </>
  );
}
