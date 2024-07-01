import { ExternalLinkIcon, GithubIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributeAnchorTarget } from "react";
import Logo from "~/components/layout/logo";

export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Logo href="/" />

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Streamline your shopkeeping with our free cutting-edge tools and
              services.
            </p>

            <div className="mt-8 flex space-x-6">
              <a className="hover:opacity-75" href="#" target="_blank">
                <span className="sr-only">GitHub</span>
                <GithubIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium">Community</p>

              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <FooterLink href="#" title="About" />

                <FooterLink href="#" title="Open Source" />
              </nav>
            </div>

            <div>
              <p className="font-medium">Tools</p>

              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <FooterLink href="#" title="Your Heroes" />

                <FooterLink href="#" title="Your Champions" />

                <FooterLink href="#" title="Lineup Simulator" />

                <FooterLink
                  href="https://st-central.net/heroic-information/"
                  title="Hero Academia"
                  target="_blank"
                />
              </nav>
            </div>

            <div>
              <p className="font-medium">Helpful Links</p>

              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <FooterLink href="#" title="Contact" />
                <FooterLink href="#" title="FAQ" />
              </nav>
            </div>

            <div>
              <p className="font-medium">Legal</p>

              <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <FooterLink href="#" title="Privacy Policy" />
                <FooterLink href="#" title="Terms &amp; Conditions" />
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2 text-xs">
          <p>
            We are not endorsed, sponsored or commissioned by Kabam Games inc.
          </p>

          <p>
            Disclaimer: All trademarks and registered trademarks are the
            property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  title,
  target,
}: {
  href: string;
  title: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary hover:underline focus:text-primary focus:underline"
      target={target}
    >
      {title}
      {target === "_blank" && <ExternalLinkIcon className="h-4 w-4" />}
    </Link>
  );
}
