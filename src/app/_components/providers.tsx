"use client";

import {
  type QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { createQueryClient } from "~/lib/query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { TooltipProvider } from "~/components/ui/tooltip";
import { ThemeProvider } from "~/components/theme/provider";

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }

    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </ReactQueryStreamedHydration>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
