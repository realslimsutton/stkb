import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUrl(url: string, params: Record<string, string>) {
  return `${url}?${new URLSearchParams(params).toString()}`;
}

export function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
