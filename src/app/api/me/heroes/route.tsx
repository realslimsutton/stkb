import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { blueprints } from "~/server/db/schema";
import { fetchAccount, getUser } from "~/shop-titans/utils";

const cache = new Map();

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.cachedFixedWindow(1, "5 m"),
  ephemeralCache: cache,
});

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { success } = await ratelimit.limit(user.uuid);
  if (!success) {
    return new NextResponse(null, { status: 429 });
  }

  const account = await fetchAccount();
  if (!account) {
    return new NextResponse(null, { status: 500 });
  }

  const heroes = account.user.adventurers;
  heroes.sort((a, b) => {
    if (b.level !== a.level) {
      return b.level - a.level;
    }

    return a.name.localeCompare(b.name);
  });

  const itemIds = heroes.flatMap((hero) => hero.items).map((item) => item.uid);

  const items = await db.query.blueprints.findMany({
    where: and(inArray(blueprints.id, itemIds)),
  });

  return NextResponse.json(
    heroes.map((hero) => {
      return {
        ...hero,
        items: hero.items
          .map((item) => {
            const blueprint = items.find(
              (blueprint) => blueprint.id === item.uid,
            );
            if (!blueprint) {
              return null;
            }

            return {
              ...blueprint,
              tag1: item.tag1,
            };
          })
          .filter((item) => item !== null),
      };
    }),
  );
}
