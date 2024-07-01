"use server";

import { WebSocket } from "partysocket";
import * as React from "react";
import { generateUrl } from "~/lib/utils";
import { type Account, type User } from "~/types";
import { getToken } from "./utils";

export const getUser = React.cache(async () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const user = await getXSollaUser(token);
  if (!user) {
    return null;
  }

  try {
    const response = await fetch(
      generateUrl("https://shopr-live.ripostegames.com/checkuser", {
        p: "Xsolla",
        v: user.id,
        d: "undefined",
      }),
      {
        cache: "no-store",
      },
    );

    if (response.status !== 200) {
      return null;
    }

    user.userInfo = (await response.json()) as User["userInfo"];

    return user;
  } catch {
    return null;
  }
});

export const getAccount = React.cache(
  () =>
    new Promise<Account | null>((resolve) => {
      getUser()
        .then((user) => {
          if (!user) {
            resolve(null);
            return;
          }

          const token = getToken();

          setTimeout(() => resolve(null), 5000);

          const ws = new WebSocket("wss://shopr-live.ripostegames.com/", [], {
            connectionTimeout: 500,
            maxRetries: 3,
          });

          ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data as string) as {
              events: { event: string; data: unknown }[];
            };

            if (!data?.events || data.events?.[0]?.event !== "SignInEvent") {
              return;
            }

            resolve(data.events[0].data as Account);
            ws.close();
          });

          ws.addEventListener("close", () => {
            if (ws.retryCount >= 3) {
              resolve(null);
            }
          });

          ws.addEventListener("error", () => {
            ws.close();
          });

          ws.addEventListener("open", () => {
            ws.send(
              JSON.stringify({
                id: user.id,
                token: token,
                email: user.email,
                authType: "Xsolla",
                uuid: user.userInfo.uuid,
                command: "Authenticate",
              }),
            );
          });
        })
        .catch(() => resolve(null));
    }),
);

async function getXSollaUser(token: string) {
  try {
    const response = await fetch(`https://login.xsolla.com/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status !== 200) {
      return null;
    }

    return (await response.json()) as User;
  } catch {
    return null;
  }
}
