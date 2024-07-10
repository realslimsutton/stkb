import Link from "next/link";
import PageHeader from "../_components/page-header";

export const metadata = {
  title: "Privacy Policy | Shop Titans Knowledge Base",
};

export default async function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader>Privacy Policy</PageHeader>

      <div className="container mx-auto space-y-6">
        <p>
          Shop Titans Knowledge Base (STKB) is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, and
          disclose your information when you use our website.
        </p>

        <ol className="list-decimal space-y-6">
          <Section title="Information We Collect">
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <span className="font-semibold">Personal Information:</span> We
                collect your email address when you use certain features of our
                website. This email address is passed directly to Kabam, the
                developers of "Shop Titans," who then provide us with your game
                account information.
              </li>

              <li>
                <span className="font-semibold">Usage Data:</span> We collect
                anonymous usage data through Posthog to help us understand how
                our website is used and to improve its functionality. This data
                may include information such as your IP address, browser type,
                operating system, pages viewed, and the date and time of your
                visit.
              </li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <span className="font-semibold">
                  To Provide and Maintain Our Service:
                </span>{" "}
                We use your email address to retrieve your game account
                information from Kabam. This information is stored in an
                encrypted cookie, which serves as your session and is essential
                for the website's functionality. We do not store your email
                address or any game account information on our servers.
              </li>

              <li>
                <span className="font-semibold">To Improve Our Website:</span>{" "}
                We analyze anonymous usage data to improve the functionality and
                user experience of our website.
              </li>
            </ul>
          </Section>

          <Section title="Storage and Security of Your Information">
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <span className="font-semibold">Encrypted Cookies:</span> Your
                game account information, along with your email address, is
                stored in an encrypted cookie on your device. This cookie is
                necessary for the website to function and helps maintain your
                session securely. We do not store any personal information on
                our servers.
              </li>

              <li>
                <span className="font-semibold">Security Measures:</span> We
                implement a variety of security measures to maintain the safety
                of your data. However, no method of transmission over the
                Internet or electronic storage is completely secure, and we
                cannot guarantee its absolute security.
              </li>
            </ul>
          </Section>

          <Section title="Sharing Your Information">
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties, except as described below:
            </p>

            <ul className="ml-4 list-disc space-y-2">
              <li>
                <span className="font-semibold">With Kabam:</span> We share your
                email address with Kabam to obtain your game account
                information. This process happens directly between your browser
                and Kabam, with STKB acting as a facilitator.
              </li>

              <li>
                <span className="font-semibold">
                  Third-Party Service Providers:
                </span>{" "}
                We may share anonymous usage data with third-party service
                providers, like Posthog, who assist us in analyzing website
                usage. These service providers are obligated to keep the data
                confidential and use it solely for providing their services to
                us.
              </li>

              <li>
                <span className="font-semibold">Legal Requirements:</span> We
                may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>
              We use cookies to enhance your experience on our website. Cookies
              are small data files stored on your device. The encrypted cookie
              containing your game account information and email address is
              essential for the website to function. You can choose to disable
              cookies through your browser settings, but this may affect your
              ability to use some features of our website.
            </p>
          </Section>

          <Section title="Third-Party Links">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these websites and
            encourage you to read their privacy policies.
          </Section>

          <Section title="Children's Privacy">
            STKB is not intended for use by children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If we become aware that we have inadvertently received personal
            information from a user under the age of 13, we will delete such
            information from our records.
          </Section>

          <Section title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and the date of the latest revision
              will be indicated at the top of the policy.
            </p>
          </Section>

          <Section title="Contact Us">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <Link href="mailto:hello@stkb.app" className="underline">
              hello@stkb.app
            </Link>
            .
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
