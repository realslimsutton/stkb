import Link from "next/link";
import PageHeader from "../_components/page-header";

export const metadata = {
  title: "About | Shop Titans Knowledge Base",
};

export default async function AboutPage() {
  return (
    <>
      <PageHeader>About</PageHeader>

      <div className="container mx-auto space-y-6">
        <Section title="Welcome to Shop Titans Knowledge Base (STKB)">
          <p>
            At Shop Titans Knowledge Base (STKB), we are passionate about
            helping players of the popular game &quot;Shop Titans&quot; enhance
            their gaming experience. Our mission is to provide a comprehensive
            and user-friendly resource for all things related to the game,
            offering a variety of tools and information to help you progress and
            succeed.
          </p>
        </Section>

        <Section title="Who We Are">
          <p>
            STKB was created by dedicated fans of &quot;Shop Titans&quot; who
            wanted to share their knowledge and tips with the gaming community.
            Our team consists of experienced players and developers who are
            committed to delivering accurate and up-to-date content. We
            understand the challenges and excitement of running a virtual shop,
            crafting powerful items, and managing a team of heroes, and we aim
            to make these experiences even more enjoyable for our users.
          </p>
        </Section>

        <Section title="What We Offer">
          <ul className="ml-8 list-disc space-y-2">
            <li>
              <span className="font-semibold">Comprehensive Guides:</span> From
              beginner tips to advanced strategies, our guides cover all aspects
              of &quot;Shop Titans&quot;. Whether you&apos;re just starting out
              or looking to optimize your gameplay, we have the resources you
              need.
            </li>

            <li>
              <span className="font-semibold">Interactive Tools:</span> Our free
              tools are designed to assist you in various aspects of the game,
              including crafting calculators, resource management tools, and
              more. These tools are easy to use and can help you make informed
              decisions.
            </li>

            <li>
              <span className="font-semibold">Regular Updates:</span> The world
              of &quot;Shop Titans&quot; is constantly evolving, and so is our
              website. We keep our content fresh with regular updates, new
              guides, and the latest news from the game.
            </li>
          </ul>
        </Section>

        <Section title="Our Commitment">
          <p>
            We are committed to maintaining a safe, welcoming, and informative
            environment for all players. Your privacy is important to us, and we
            ensure that our site adheres to strict privacy standards. We do not
            collect personal information, and our use of anonymous usage data
            through Posthog is solely for the purpose of improving our services.
          </p>
        </Section>

        <p>
          Thank you for visiting STKB. We hope you find our website helpful and
          enjoyable. If you have any questions, suggestions, or feedback, please
          feel free to contact us at{" "}
          <Link href="mailto:hello@stkb.app" className="underline">
            hello@stkb.app
          </Link>
          .
        </p>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <Header title={title} />
      {children}
    </section>
  );
}

function Header({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold">{title}</h2>;
}
