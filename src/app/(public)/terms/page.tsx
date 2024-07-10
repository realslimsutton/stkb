import Link from "next/link";
import PageHeader from "../_components/page-header";

export const metadata = {
  title: "Privacy Policy | Shop Titans Knowledge Base",
};

export default async function TermsOfServicePage() {
  return (
    <>
      <PageHeader>Terms of Service</PageHeader>

      <div className="container mx-auto space-y-6">
        <p>
          Welcome to Shop Titans Knowledge Base (STKB). By accessing or using
          our website, you agree to comply with and be bound by the following
          terms of service. Please review them carefully.
        </p>

        <ol className="list-decimal space-y-6">
          <Section title="Acceptance of Terms">
            By using STKB, you agree to these Terms of Service and our{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use our website.
          </Section>

          <Section title="Use of the Website">
            <p>
              STKB is provided free of charge for users to access various tools
              and information related to the game &quot;Shop Titans.&quot; You
              agree to use our website only for lawful purposes and in a manner
              that does not infringe the rights of, restrict, or inhibit anyone
              else&apos;s use and enjoyment of the website.
            </p>
          </Section>

          <Section title="Intellectual Property">
            All content on STKB, including but not limited to text, graphics,
            logos, and software, is the property of STKB or its content
            suppliers and is protected by copyright and other intellectual
            property laws. Unauthorized use of any content may violate these
            laws.
          </Section>

          <Section title="User Content">
            <p>
              By submitting content to STKB (e.g., comments, forum posts), you
              grant us a non-exclusive, royalty-free, perpetual, and worldwide
              license to use, modify, and display such content. You are
              responsible for ensuring that you have the right to submit the
              content and that it does not violate any third-party rights.
            </p>
          </Section>

          <Section title="Disclaimers and Limitation of Liability">
            STKB is provided &quot;as is&quot; and without warranties of any
            kind, either express or implied. We do not warrant that the website
            will be uninterrupted or error-free. In no event will STKB be liable
            for any damages arising from the use or inability to use our
            website.
          </Section>

          <Section title="External Links">
            STKB may contain links to external websites. We are not responsible
            for the content or reliability of these external sites and do not
            endorse the views expressed within them.
          </Section>

          <Section title="Changes to Terms">
            We reserve the right to modify these Terms and Conditions at any
            time. Any changes will be posted on this page, and your continued
            use of the website constitutes acceptance of the modified terms.
          </Section>

          <Section title="Governing Law">
            These Terms and Conditions are governed by and construed in
            accordance with the laws of England, Great Britain, and you
            irrevocably submit to the exclusive jurisdiction of the courts in
            that location.
          </Section>
        </ol>
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
    <li className="space-y-2">
      <Header title={title} />
      {children}
    </li>
  );
}

function Header({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold">{title}</h2>;
}
