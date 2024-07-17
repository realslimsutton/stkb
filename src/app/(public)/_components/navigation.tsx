import { ExternalLinkIcon } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { Badge } from "~/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import DesktopNavigationItems from "./navigation/desktop-items";

export function DesktopNavigation({
  authNavigation,
}: {
  authNavigation: React.ReactNode;
}) {
  return (
    <>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <DesktopNavigationItems />

          {authNavigation}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

export const DesktopListItem = React.forwardRef<
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

export const MobileListDropdownItem = React.forwardRef<
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
