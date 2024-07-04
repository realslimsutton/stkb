"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import Logo from "~/components/layout/logo";
import { cn } from "~/lib/utils";
import { DesktopNavigation, MobileNavigation } from "./navigation";
import { type User } from "~/types";

export default function Header({
  user,
  marketImportEnabled,
}: {
  user: User | null;
  marketImportEnabled: boolean;
}) {
  const { ref, inView } = useInView({
    initialInView: true,
  });

  return (
    <>
      <div ref={ref}></div>

      <header
        className={cn({
          "fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex w-[95%] max-w-[90rem] items-center justify-between rounded-2xl px-4 py-4 antialiased transition-all md:w-full md:px-10":
            true,
          "bg-secondary/50 shadow shadow-secondary backdrop-blur-xl": !inView,
        })}
      >
        <Logo href="/" className="mr-auto" />

        <DesktopNavigation
          user={user}
          marketImportEnabled={marketImportEnabled}
        />

        <MobileNavigation />
      </header>
    </>
  );
}
