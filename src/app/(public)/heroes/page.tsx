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
      <PageHeader>Heroes</PageHeader>

      <div className="container mx-auto">
        <div className="w-full rounded-lg border bg-background shadow-xl">
          <MarketItemsProvider>
            <HeroesProvider>
              <HeroTable />
            </HeroesProvider>
          </MarketItemsProvider>
        </div>
      </div>
    </>
  );
}
