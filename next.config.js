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
  async rewrites() {
    return [
      {
        source: "/xsolla/api/:path*",
        destination: "https://login.xsolla.com/api/:path*",
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
};

export default config;
