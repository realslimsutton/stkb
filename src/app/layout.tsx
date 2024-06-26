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
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
