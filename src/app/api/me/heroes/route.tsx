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
  limiter: Ratelimit.slidingWindow(5, "10 s"),
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

  return NextResponse.json(heroes);
}
