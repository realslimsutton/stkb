import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUrl(url: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${url}?${searchParams.toString()}`;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
