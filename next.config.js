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
    return {
      beforeFiles: [
        {
          source: "/api/proxy/xsolla/login/email/request",
          destination:
            "https://login.xsolla.com/api/oauth2/login/email/request",
        },
      ],
      afterFiles: [
        {
          source: "/api/proxy/xsolla/login/email/request",
          destination:
            "https://login.xsolla.com/api/oauth2/login/email/request",
        },
      ],
      fallback: [
        {
          source: "/api/proxy/xsolla/login/email/request",
          destination:
            "https://login.xsolla.com/api/oauth2/login/email/request",
        },
      ],
    };
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

export default config;
