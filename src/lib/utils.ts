import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUrl(url: string, params: Record<string, string>) {
  return `${url}?${new URLSearchParams(params).toString()}`;
}
