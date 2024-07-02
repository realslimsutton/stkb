import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import postgres from "postgres";
import { sql } from "@vercel/postgres";
import { env } from "~/env";
import * as schema from "./schema";

const isProduction = env.NODE_ENV === "production";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | typeof sql | undefined;
};

const conn =
  globalForDb.conn ?? (isProduction ? sql : postgres(env.POSTGRES_URL));

if (!isProduction) {
  globalForDb.conn = conn;
}

export const db = isProduction
  ? drizzleVercel(conn as typeof sql, { schema })
  : drizzlePostgres(conn as postgres.Sql, { schema });
