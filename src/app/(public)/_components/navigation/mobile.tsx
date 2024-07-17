"use client";

import { ChevronRightIcon, MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { MobileListDropdownItem } from "../navigation";
import * as React from "react";
import Link from "next/link";

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
