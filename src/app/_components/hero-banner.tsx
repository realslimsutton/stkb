import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import ChampionGlobe from "./champion-globe";

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center py-24 lg:py-32">
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
      <div className="absolute hidden h-full w-full bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:block"></div>

      <div className="container relative grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className=" inline-flex min-w-[theme(spacing.6)] items-center justify-center gap-x-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30">
              Now launching in Alpha!
            </div>

            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Turn your shop into a{" "}
              <span className="text-primary">powerhouse</span>
            </h1>

            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Streamline your shopkeeping with our free cutting-edge tools and
              services.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>

            <Button
              variant="outlineIcon"
              size="lg"
              Icon={ArrowRightIcon}
              iconPlacement="right"
              asChild
            >
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>

        <ChampionGlobe />
      </div>
    </section>
  );
}
