import { getSession } from "~/auth";
import * as React from "react";

export async function LoggedIn({ children }: { children: React.ReactNode }) {
  const { token, user } = await getSession();
  if (!token || !user) {
    return null;
  }

  return <>{children}</>;
}

export async function LoggedOut({ children }: { children: React.ReactNode }) {
  const { token, user } = await getSession();
  if (token ?? user) {
    return null;
  }

  return <>{children}</>;
}
