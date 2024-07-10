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
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
      <div className="absolute hidden h-full w-full bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:block"></div>

      <div className="relative">
        <PageHeader>Market</PageHeader>

        <div className="container relative mx-auto">
          <MarketProvider debug={isDev}>
            <MarketGrid />
          </MarketProvider>
        </div>
      </div>
    </>
  );
}
