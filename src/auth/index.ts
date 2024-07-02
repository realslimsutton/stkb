"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import * as React from "react";
import { env } from "~/env";
import { type SessionData } from "../types/index";

export const getSession = React.cache(async () => {
  return await getIronSession<SessionData>(cookies(), {
    cookieName: "stkb-session",
    password: env.SESSION_SECRET,
    cookieOptions: {
      secure: env.NODE_ENV === "production",
    },
  });
});
