"use server";

import { WebSocket } from "partysocket";
import * as React from "react";
import { getSession } from "~/auth";
import { generateUrl } from "~/lib/utils";
import { type XSollaUser, type Account, type User } from "~/types";

export const getUser = React.cache(async () => {
  const { token, user } = await getSession();
  if (!token || !user) {
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

    return (await response.json()) as User;
  } catch {
    return null;
  }
});

export const fetchAccount = React.cache(
  () =>
    new Promise<Account | null>((resolve) => {
      Promise.all([getUser(), getSession()])
        .then(([user, { token, user: xSollaUser }]) => {
          if (!user || !token || !xSollaUser) {
            resolve(null);
            return;
          }

          setTimeout(() => resolve(null), 5000);

          const ws = new WebSocket("wss://shopr-live2.ripostegames.com", [], {
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

          console.log({
            id: xSollaUser.id,
            token: token,
            email: xSollaUser.email,
            authType: "Xsolla",
            uuid: user.uuid,
            command: "Authenticate",
          });

          ws.addEventListener("open", () => {
            ws.send(
              JSON.stringify({
                id: xSollaUser.id,
                token: token,
                email: xSollaUser.email,
                authType: "Xsolla",
                uuid: user.uuid,
                command: "Authenticate",
              }),
            );
          });
        })
        .catch(() => resolve(null));
    }),
);

export async function getXSollaUser(token: string) {
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

    return (await response.json()) as XSollaUser;
  } catch {
    return null;
  }
}
