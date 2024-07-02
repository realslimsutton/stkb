import { db } from "../../src/server/db";
import { parse } from "csv-parse/sync";
import { generateUrl } from "./utils";
import { workers } from "~/server/db/schema";
import { type InferSelectModel, sql } from "drizzle-orm";

async function main() {
  const response = await fetch(generateUrl(1935922361));

  if (response.status !== 200) {
    console.error("Failed to fetch input data");
    return;
  }

  const records: string[][] = parse(await response.text(), {
    columns: false,
    from: 2,
  }) as string[][];

  const inserts: Omit<InferSelectModel<typeof workers>, "id">[] = [];
  for (let i = 0, length = records.length; i < length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [worker, name, levelRequired, building, gold, gem] = records[i]!;
    if (!worker || !name) {
      console.log(`Failed to parse record on row ${i + 1}`);
      continue;
    }

    inserts.push({
      name,
      title: worker,
      levelRequired:
        levelRequired === "---" ? 0 : parseInt(levelRequired ?? "0"),
      gem: gem === "---" ? 0 : parseInt(gem ?? "0"),
      gold: gold === "---" ? 0 : parseInt(gold ?? "0"),
      image: "",
    });
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(workers)
      .values(inserts)
      .onConflictDoUpdate({
        target: [workers.name, workers.title],
        set: {
          levelRequired: sql`excluded.${workers.levelRequired}`,
          gold: sql`excluded.${workers.gold}`,
          gem: sql`excluded.${workers.gem}`,
        },
      });
  });

  console.log(`Inserted ${inserts.length} workers`);
}

await main();
