"use client";

import { ChevronRightIcon, ExternalLinkIcon, MenuIcon } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import Logo from "~/components/layout/logo";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import * as React from "react";
import Image from "next/image";

import HeroBackground from "~/../public/images/background_collection_portrait.png";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "~/components/theme/toggle";

export function DesktopNavigation() {
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

  const isLiveMarketPage = React.useMemo(
    () => isRouteActive(pathname, "/market/live"),
    [pathname],
  );

  const isMarketHistoryPage = React.useMemo(
    () => isRouteActive(pathname, "/market/history"),
    [pathname],
  );

  const isBlogPage = React.useMemo(
    () => isRouteActive(pathname, "/blog"),
    [pathname],
  );

  const isFaqPage = React.useMemo(
    () => isRouteActive(pathname, "/faq"),
    [pathname],
  );

  const isContactPage = React.useMemo(
    () => isRouteActive(pathname, "/contact"),
    [pathname],
  );

  return (
    <>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
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
                          src={HeroBackground}
                          alt="Hero Academia"
                          style={{ height: "100%", width: "100%" }}
                          placeholder="blur"
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
                  href="#"
                  title="Your Heroes"
                  active={isHeroPage}
                >
                  Track your hero progression &amp; statistics.
                </DesktopListItem>

                <DesktopListItem
                  href="#"
                  title="Your Champions"
                  active={isChampionPage}
                >
                  Track your champion progression &amp; statistics.
                </DesktopListItem>

                <DesktopListItem
                  href="#"
                  title="Lineup Simulator"
                  active={isHeroSimulatorPage}
                >
                  Simulate hero lineups.
                </DesktopListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn({
                "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent":
                  true,
                "text-muted-foreground":
                  !isLiveMarketPage && !isMarketHistoryPage,
                "text-accent-foreground":
                  isLiveMarketPage || isMarketHistoryPage,
              })}
            >
              Market
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[400px] p-2">
                <DesktopListItem
                  href="/"
                  title="Live Market"
                  active={isLiveMarketPage}
                >
                  View the current prices of the market.
                </DesktopListItem>

                <DesktopListItem
                  href="/history"
                  title="Market History"
                  active={isMarketHistoryPage}
                >
                  View historical data of the market.
                </DesktopListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn({
                "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent":
                  true,
                "text-muted-foreground": !isBlogPage && !isFaqPage,
                "text-accent-foreground": isBlogPage || isFaqPage,
              })}
            >
              Resources
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[550px] grid-cols-2 p-2">
                <DesktopListItem href="/" title="Blog" active={isBlogPage}>
                  Read our latest blog posts.
                </DesktopListItem>

                <DesktopListItem href="/" title="FAQ" active={isFaqPage}>
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

          <NavigationMenuLink asChild>
            <Button
              variant="link"
              className={cn({
                "hover:text-accent-foreground hover:no-underline focus:text-accent-foreground":
                  true,
                "text-muted-foreground": !isContactPage,
                "text-accent-foreground": isContactPage,
              })}
              asChild
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </NavigationMenuLink>

          <NavigationMenuLink asChild>
            <Button asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto" side="left">
        <div className="grid gap-2 py-6">
          <Collapsible className="grid gap-4">
            <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
              Heroes{" "}
              <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="-mx-6 grid gap-6 bg-muted p-6">
                <MobileListDropdownItem href="#" title="Your Heroes">
                  Track your hero progression &amp; statistics.
                </MobileListDropdownItem>

                <MobileListDropdownItem href="#" title="Your Champions">
                  Track your champion progression &amp; statistics.
                </MobileListDropdownItem>

                <MobileListDropdownItem href="#" title="Lineup Simulator">
                  Simulate hero lineups.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="https://st-central.net/heroic-information/"
                  target="_blank"
                  title="Hero Academia"
                >
                  If you&#039;re brand new to Shop Titans and don&#039;t know
                  anything at all about heroes check out this handy beginner
                  page.
                </MobileListDropdownItem>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="grid gap-4">
            <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
              Market{" "}
              <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="-mx-6 grid gap-6 bg-muted p-6">
                <MobileListDropdownItem href="/" title="Live Market">
                  View the current prices of the market.
                </MobileListDropdownItem>

                <MobileListDropdownItem href="/history" title="Market History">
                  View historical data of the market.
                </MobileListDropdownItem>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="grid gap-4">
            <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
              Resources{" "}
              <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="-mx-6 grid gap-6 bg-muted p-6">
                <MobileListDropdownItem href="/" title="Blog">
                  Read our latest blog posts.
                </MobileListDropdownItem>

                <MobileListDropdownItem href="/" title="FAQ">
                  Frequently asked questions.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="https://st-central.net/"
                  target="_blank"
                  title="ST Central"
                >
                  In-depth guides and tools.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="https://playshoptitans.com/"
                  target="_blank"
                  title="Offical Website"
                >
                  Play Shop Titans!
                </MobileListDropdownItem>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href="#"
            className="flex w-full items-center text-lg font-semibold"
          >
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const DesktopListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & LinkProps & { active: boolean }
>(({ className, title, children, target, active, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          target={target}
          className={cn({
            "block select-none space-y-1 rounded-md p-3 font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground":
              true,
            "text-accent-foreground": active,
            [className ?? ""]: true,
          })}
          {...props}
        >
          <div className="flex items-center gap-1 text-sm leading-none">
            {title}{" "}
            {target === "_blank" && <ExternalLinkIcon className="h-4 w-4" />}
          </div>

          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
DesktopListItem.displayName = "DesktopListItem";

const MobileListDropdownItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & LinkProps
>(({ className, title, children, target, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      target={target}
      className={cn("grid h-auto w-full justify-start gap-1", className)}
      {...props}
    >
      <div className="flex items-center gap-1 text-sm font-medium leading-none">
        {title}{" "}
        {target === "_blank" && <ExternalLinkIcon className="h-4 w-4" />}
      </div>

      <div className="text-sm leading-snug text-muted-foreground">
        {children}
      </div>
    </Link>
  );
});
MobileListDropdownItem.displayName = "MobileListDropdownItem";

function isRouteActive(pathname: string, routes: string | string[]) {
  if (Array.isArray(routes)) {
    return routes.some((route) => pathname.startsWith(route));
  }

  if (routes === "/" && pathname !== "/") {
    return false;
  }

  if (routes === "/heroes" && pathname === "/heros/simulator") {
    return false;
  }

  return pathname.startsWith(routes);
}
