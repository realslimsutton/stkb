"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon, ExternalLinkIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import HeroBackground from "~/../public/images/hero_academia_background.png";
import { logout } from "~/auth/utils";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { type User } from "~/types";
import importSpreadsheet from "../_actions/import-spreadsheet";
import { importFormSchema } from "../_lib/import-schema";
import { enableMarketImport } from "~/server/flags";

export function DesktopNavigation({
  user,
  marketImportEnabled,
}: {
  user: User | null;
  marketImportEnabled: boolean;
}) {
  const router = useRouter();
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

          {marketImportEnabled && (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn({
                  "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent":
                    true,
                  "text-muted-foreground": !isMarketPage,
                  "text-accent-foreground": isMarketPage,
                })}
              >
                Market
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid w-[400px] p-2">
                  <DesktopListItem
                    href="/market"
                    title="Live Market"
                    active={isMarketPage}
                  >
                    View market items and prices
                  </DesktopListItem>

                  <SpreadsheetImporter />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {!marketImportEnabled && (
            <NavigationMenuLink asChild>
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
            </NavigationMenuLink>
          )}

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
                <DesktopListItem href="/" title="Blog" active={isBlogPage}>
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

          {user && (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{user.name}</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={async () => {
                      await logout();

                      toast.success("You have been successfully logged out.", {
                        action: {
                          label: "Login",
                          onClick: () => {
                            router.push("/auth/login");
                          },
                        },
                      });

                      router.push("/");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          )}

          {!user && (
            <NavigationMenuLink asChild>
              <Button asChild>
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </NavigationMenuLink>
          )}
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

                <MobileListDropdownItem href="/#faq" title="FAQ">
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

function SpreadsheetImporter() {
  async function handleImport() {
    const toastId = toast.loading(`Importing data...`);

    try {
      if (!(await importSpreadsheet())) {
        throw new Error();
      }

      toast.success("Successfully imported data.", {
        id: toastId,
      });
    } catch {
      toast.error("Failed to import data.", {
        id: toastId,
      });
    }
  }

  return (
    <li>
      <Dialog>
        <DialogTrigger asChild>
          <NavigationMenuItem asChild>
            <button className="block w-full select-none space-y-1 rounded-md p-3 font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              <div className="flex items-center gap-1 text-sm leading-none">
                Import Market Data
              </div>

              <p className="line-clamp-2 text-left text-sm leading-snug text-muted-foreground">
                Import data from the spreadsheet.
              </p>
            </button>
          </NavigationMenuItem>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Automatically import data from the spreadsheet.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm">
            Are you sure you want to import all data from the spreadsheet?
          </p>

          <p className="text-sm text-destructive">
            <span className="font-medium">Note:</span> Images will need
            uploading separately.
          </p>

          <DialogFooter>
            <Button onClick={async () => await handleImport()}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
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