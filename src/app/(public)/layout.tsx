import * as React from "react";
import { getUser } from "~/shop-titans/utils";
import Footer from "./_components/footer";
import Header from "./_components/header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <>
      <Header user={user} />

      {children}

      <Footer />
    </>
  );
}
