import { env } from "~/env";
import PageHeader from "../_components/page-header";
import { MarketProvider } from "./_components/market-context";
import MarketGrid from "./_components/market-grid";

export const metadata = {
  title: "Market | Shop Titans Knowledge Base",
};

export default async function MarketPage() {
  const isDev = env.NODE_ENV === "development";

  return (
    <>
      <PageHeader>Market</PageHeader>

      <div className="container mx-auto">
        <MarketProvider debug={isDev}>
          <MarketGrid />
        </MarketProvider>
      </div>
    </>
  );
}
