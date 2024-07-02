import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import Providers from "./_components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Shop Titans Knowledge Base",
  description:
    "A community-run knowledge base for the mobile game Shop Titans.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: "/api/og",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <Providers>
          <a href="#content" className="sr-only focus:not-sr-only">
            Skip to content
          </a>

          <main id="content">{children}</main>

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
