import { withVercelToolbar } from "@vercel/toolbar/plugins/next";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f9w4sqozvcfkizrn.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/xsolla/:path*",
        destination: "https://playshoptitans.com/api/xsolla/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default withVercelToolbar()(config);
