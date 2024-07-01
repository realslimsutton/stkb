import { cookies } from "next/headers";

export function getToken() {
  return cookies().get("xsolla_token")?.value ?? null;
}
