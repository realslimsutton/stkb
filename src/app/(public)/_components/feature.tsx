import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getUser } from "~/shop-titans/utils";

export default async function Feature() {
  const user = await getUser();

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container space-y-4 px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Integration with the Shop Titans API
        </h2>

        <p className="mx-auto max-w-[600px] text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Connect to your Kabam Cross Connect account to automatically sync your
          shop data with our tools.
        </p>

        <div className="flex items-center justify-center">
          <Button size="lg" asChild>
            <Link href={user ? "/heroes" : "/auth/login"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
