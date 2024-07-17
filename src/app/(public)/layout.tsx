import * as React from "react";
import Footer from "./_components/footer";
import Header from "./_components/header";
import AuthNavigation from "./_components/navigation/auth";
import { NavigationMenuLink } from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
      <div className="absolute hidden h-full w-full bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:block"></div>

      <Header
        authNavigation={
          <React.Suspense
            fallback={
              <NavigationMenuLink asChild>
                <Button asChild>
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </NavigationMenuLink>
            }
          >
            <AuthNavigation />
          </React.Suspense>
        }
      />

      <div className="relative">{children}</div>

      <Footer />
    </>
  );
}
