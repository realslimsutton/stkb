import { type ClassValue, clsx } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUrl(url: string, params: Record<string, string>) {
  return `${url}?${new URLSearchParams(params).toString()}`;
}

export function createQueryString(
  params: Record<string, unknown>,
  searchParams: ReadonlyURLSearchParams | null = null,
) {
  const currentSearchParams =
    searchParams?.toString() ?? typeof window !== "undefined"
      ? window.location.search
      : undefined;

  const newSearchParams = new URLSearchParams(currentSearchParams);

  for (const [key, value] of Object.entries(params)) {
    if (value === null || typeof value === "undefined") {
      newSearchParams.delete(key);
    } else if (Array.isArray(value)) {
      newSearchParams.delete(key);

      for (const v of value) {
        newSearchParams.append(key, String(v));
      }
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}
