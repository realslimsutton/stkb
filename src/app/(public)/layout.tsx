import * as React from "react";
import { getUser } from "~/shop-titans/utils";
import { enableMarketImport } from "~/server/flags/index";
import Footer from "./_components/footer";
import Header from "./_components/header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const marketImportEnabled = await enableMarketImport();

  return (
    <>
      <Header user={user} marketImportEnabled={marketImportEnabled} />

      {children}

      <Footer />
    </>
  );
}
