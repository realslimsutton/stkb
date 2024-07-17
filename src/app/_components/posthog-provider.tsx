"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "~/env";
import * as React from "react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
  });
}
export default function CSPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
