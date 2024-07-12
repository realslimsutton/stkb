import { redirect } from "next/navigation";
import { MarketItemsProvider } from "~/components/context/market-items-context";
import { getUser } from "~/shop-titans/utils";
import PageHeader from "../_components/page-header";
import HeroTable from "./_components/hero-table";
import { HeroesProvider } from "~/components/context/heroes-context";

export default async function Heroes() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
      <div className="absolute hidden h-full w-full bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:block"></div>

      <div className="relative">
        <PageHeader>Heroes</PageHeader>

        <div className="container relative mx-auto">
          <div className="w-full rounded-lg border bg-background shadow-xl">
            <MarketItemsProvider>
              <HeroesProvider>
                <HeroTable />
              </HeroesProvider>
            </MarketItemsProvider>
          </div>
        </div>
      </div>
    </>
  );
}
