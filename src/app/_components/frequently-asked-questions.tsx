import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function FrequentlyAskedQuestions() {
  return (
    <section className="w-full bg-secondary py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>

            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Wondering about something? Check out our FAQs for thorough answers
              to the most common inquiries.
            </p>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Contact us
              </Link>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger>
                What data do you store about me?
              </AccordionTrigger>
              <AccordionContent>
                We don&apos;t store any personal data about you. When logging
                in, your email address is set straight to Kabam&apos;s servers
                and we don&apos;t store it in our database. Kabam will then
                provide us with a token that&apos;s stored in a cookie to
                authenticate you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="2">
              <AccordionTrigger>
                How are you connecting to the Shop Titans API?
              </AccordionTrigger>
              <AccordionContent>
                To prevent abuse or bad actors, we&apos;re keeping this
                information confidential. Want to contribute to the project?
                Visit our{" "}
                <Link href="/contribute" className="underline">
                  GitHub
                </Link>
                .
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3">
              <AccordionTrigger>How do these tools work?</AccordionTrigger>
              <AccordionContent>
                We&apos;ve collated multiple community (and offically) made
                resources with the aim of making it as easy and user-friendly to
                use, without compromising on user-experience. You can find
                detailed information about how our tools work on our{" "}
                <Link href="/contribute" className="underline">
                  GitHub
                </Link>
                .
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="4">
              <AccordionTrigger>How can I contribute?</AccordionTrigger>
              <AccordionContent>
                You can find the source-code on our{" "}
                <Link href="/contribute" className="underline">
                  GitHub
                </Link>
                . Code related to the Shop Titans API is closed-source.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
