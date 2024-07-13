"use client";

import { ChevronRightIcon, ExternalLinkIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { logout } from "~/auth/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { type User } from "~/types";

export function DesktopNavigation({ user }: { user: User | null }) {
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
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                <MobileListDropdownItem
                  href="/heroes"
                  title="Your Heroes"
                  onClick={() => setOpen(false)}
                >
                  Track your hero progression &amp; statistics.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="#"
                  title="Your Champions"
                  onClick={() => setOpen(false)}
                  comingSoon={true}
                >
                  Track your champion progression &amp; statistics.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="#"
                  title="Lineup Simulator"
                  onClick={() => setOpen(false)}
                  comingSoon={true}
                >
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

          <Link
            href="/market"
            className="flex w-full items-center text-lg font-semibold"
            onClick={() => setOpen(false)}
          >
            Market
          </Link>

          <Collapsible className="grid gap-4">
            <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
              Resources{" "}
              <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="-mx-6 grid gap-6 bg-muted p-6">
                <MobileListDropdownItem
                  href="#"
                  title="Blog"
                  onClick={() => setOpen(false)}
                  comingSoon={true}
                >
                  Read our latest blog posts.
                </MobileListDropdownItem>

                <MobileListDropdownItem
                  href="/#faq"
                  title="FAQ"
                  onClick={() => setOpen(false)}
                >
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
            href="mailto:hello@stkb.app"
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
  React.ComponentPropsWithoutRef<"a"> &
    LinkProps & { active: boolean; comingSoon?: boolean }
>(
  (
    {
      className,
      title,
      children,
      target,
      active,
      comingSoon = false,
      ...props
    },
    ref,
  ) => {
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
            <div className="flex flex-wrap items-center gap-1 text-sm leading-none">
              {title}{" "}
              {target === "_blank" && <ExternalLinkIcon className="h-4 w-4" />}
              {comingSoon && (
                <Badge variant="outline" className="bg-background">
                  Coming soon
                </Badge>
              )}
            </div>

            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
DesktopListItem.displayName = "DesktopListItem";

const MobileListDropdownItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & LinkProps & { comingSoon?: boolean }
>(
  (
    { className, title, children, target, comingSoon = false, ...props },
    ref,
  ) => {
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
          {comingSoon && (
            <Badge variant="outline" className="bg-background">
              Coming soon
            </Badge>
          )}
        </div>

        <div className="text-sm leading-snug text-muted-foreground">
          {children}
        </div>
      </Link>
    );
  },
);
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
