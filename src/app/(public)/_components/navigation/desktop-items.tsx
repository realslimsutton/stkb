"use client";

import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn, isRouteActive } from "~/lib/utils";
import { DesktopListItem } from "../navigation";

export default function DesktopNavigationItems() {
  const pathname = usePathname();

  const isHeroPage = React.useMemo(
    () => isRouteActive(pathname, "/heroes"),
    [pathname],
  );
  const isChampionPage = React.useMemo(
    () => isRouteActive(pathname, "/champions"),
    [pathname],
  );
  const isHeroSimulatorPage = React.useMemo(
    () => isRouteActive(pathname, "/heros/simulator"),
    [pathname],
  );

  const isMarketPage = React.useMemo(
    () => isRouteActive(pathname, "/market"),
    [pathname],
  );

  const isBlogPage = React.useMemo(
    () => isRouteActive(pathname, "/blog"),
    [pathname],
  );

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={cn({
            "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent":
              true,
            "text-muted-foreground": !isHeroPage && !isChampionPage,
            "text-accent-foreground": isHeroPage || isChampionPage,
          })}
        >
          Heroes
        </NavigationMenuTrigger>

        <NavigationMenuContent>
          <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <Link
                  href="https://st-central.net/heroic-information/"
                  target="_blank"
                  className="relative flex h-full w-full select-none p-4 font-medium text-white no-underline outline-none"
                >
                  <div>
                    <Image
                      src="https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/backgrounds/hero_academia.webp"
                      alt="Hero Academia"
                      width={189}
                      height={247}
                      style={{ height: "100%", width: "100%" }}
                      className="absolute inset-0 rounded-md object-cover"
                    />

                    <div className="absolute inset-0 rounded-md bg-black/55 dark:bg-black/60"></div>
                  </div>

                  <div className="relative flex flex-col justify-center">
                    <div className="mb-2 mt-4 flex items-center gap-1 text-lg">
                      Hero Academia <ExternalLinkIcon className="h-4 w-4" />
                    </div>

                    <p className="text-sm leading-tight">
                      If you&#039;re brand new to Shop Titans and don&#039;t
                      know anything at all about heroes check out this handy
                      beginner page.
                    </p>
                  </div>
                </Link>
              </NavigationMenuLink>
            </li>

            <DesktopListItem
              href="/heroes"
              title="Your Heroes"
              active={isHeroPage}
            >
              Track your hero progression &amp; statistics.
            </DesktopListItem>

            <DesktopListItem
              href="#"
              title="Your Champions"
              active={isChampionPage}
              comingSoon={true}
            >
              Track your champion progression &amp; statistics.
            </DesktopListItem>

            <DesktopListItem
              href="#"
              title="Lineup Simulator"
              active={isHeroSimulatorPage}
              comingSoon={true}
            >
              Simulate hero lineups.
            </DesktopListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Button
          variant="link"
          className={cn({
            "hover:text-accent-foreground hover:no-underline focus:text-accent-foreground":
              true,
            "text-muted-foreground": !isMarketPage,
            "text-accent-foreground": isMarketPage,
          })}
          asChild
        >
          <Link href="/market">Market</Link>
        </Button>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={cn({
            "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent":
              true,
            "text-muted-foreground": !isBlogPage,
            "text-accent-foreground": isBlogPage,
          })}
        >
          Resources
        </NavigationMenuTrigger>

        <NavigationMenuContent>
          <ul className="grid w-[550px] grid-cols-2 p-2">
            <DesktopListItem
              href="#"
              title="Blog"
              active={isBlogPage}
              comingSoon={true}
            >
              Read our latest blog posts.
            </DesktopListItem>

            <DesktopListItem href="/#faq" title="FAQ" active={false}>
              Frequently asked questions.
            </DesktopListItem>

            <DesktopListItem
              href="https://st-central.net/"
              target="_blank"
              title="ST Central"
              active={false}
            >
              In-depth guides and tools.
            </DesktopListItem>

            <DesktopListItem
              href="https://playshoptitans.com/"
              target="_blank"
              title="Offical Website"
              active={false}
            >
              Play Shop Titans!
            </DesktopListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Button
          variant="link"
          className="text-muted-foreground hover:text-accent-foreground hover:no-underline focus:text-accent-foreground"
          asChild
        >
          <Link href="mailto:hello@stkb.app">Contact</Link>
        </Button>
      </NavigationMenuItem>
    </>
  );
}
