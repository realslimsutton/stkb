"use server";

import { del, list, ListBlobResult, put } from "@vercel/blob";
import { InferSelectModel, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { blueprints as blueprintsSchema } from "~/server/db/schema";
import { enableMarketImport } from "~/server/flags";
import { blueprintCategories } from "~/shop-titans/data/enums";
import { Blueprint } from "~/shop-titans/types";

export default async function importSpreadsheet() {
  const marketImportEnabled = await enableMarketImport();
  if (!marketImportEnabled) {
    return false;
  }

  if (!(await deleteBlueprintImages())) {
    return false;
  }

  try {
    const response = await Promise.all(
      Object.keys(blueprintCategories).map((category) =>
        importBlueprintCategory(category as keyof typeof blueprintCategories),
      ),
    );

    return response.every((success) => success);
  } catch {
    return false;
  }
}

async function deleteBlueprintImages() {
  try {
    let cursor;

    do {
      const listResult: ListBlobResult = await list({
        mode: "expanded",
        cursor,
        limit: 1000,
        prefix: "blueprints",
      });

      if (listResult.blobs.length > 0) {
        await del(listResult.blobs.map((blob) => blob.url));
      }

      cursor = listResult.cursor;
    } while (cursor);

    return true;
  } catch {
    return false;
  }
}

async function importBlueprintCategory(
  category: keyof typeof blueprintCategories,
) {
  const allBlueprints = await Promise.all(
    blueprintCategories[category]!.map((type) => getBlueprints(category, type)),
  );

  const allItems = [];

  let success = true;
  for (const blueprints of allBlueprints) {
    if (blueprints[0] === null || blueprints[1] === null) {
      success = false;
      continue;
    }

    const images = new Map(
      (
        await Promise.all(
          blueprints[1].map(
            (blueprint) =>
              new Promise<{ id: string; url: string | null }>((resolve) => {
                const searchParams = new URLSearchParams({
                  url: `/assets/items/${blueprint.uid}.png`,
                  w: "256",
                  q: "100",
                });

                const url = `https://playshoptitans.com/_next/image?${searchParams.toString()}`;

                fetch(url, { cache: "no-store" })
                  .then((res) => {
                    res
                      .arrayBuffer()
                      .then((buffer) => {
                        put(`blueprints/${blueprint.uid}.webp`, buffer, {
                          access: "public",
                        })
                          .then((blob) => {
                            resolve({
                              id: blueprint.uid,
                              url: blob.url,
                            });
                          })
                          .catch(() =>
                            resolve({
                              id: blueprint.uid,
                              url: null,
                            }),
                          );
                      })
                      .catch(() =>
                        resolve({
                          id: blueprint.uid,
                          url: null,
                        }),
                      );
                  })
                  .catch(() =>
                    resolve({
                      id: blueprint.uid,
                      url: null,
                    }),
                  );
              }),
          ),
        )
      ).map((image) => [image.id, image.url]),
    );

    const items: InferSelectModel<typeof blueprintsSchema>[] = blueprints[1]
      .map((blueprint) => {
        const tradeMinMaxValueSplit = blueprint.tradeMinMaxValue.split(";");

        const tradeMinValue =
          tradeMinMaxValueSplit[0]?.split(",").map((step) => parseInt(step)) ??
          [];
        const tradeMaxValue =
          tradeMinMaxValueSplit[1]?.split(",").map((step) => parseInt(step)) ??
          [];

        const name = blueprints[0].get(`${blueprint.uid}_name`);
        if (!name) {
          return null;
        }

        return {
          id: blueprint.uid,
          name: name,
          category: blueprint.category,
          image: images.get(blueprint.uid) ?? null,
          type: blueprint.type,
          subtype: blueprint.subtype,
          level: blueprint.level,
          tier: blueprint.tier,
          subtier: blueprint.subtier,
          experience: blueprint.xp,
          craftExperience: blueprint.craftXp,
          value: blueprint.value,
          favor: blueprint.favor,
          time: blueprint.time,
          attack: blueprint.atk,
          defence: blueprint.def,
          health: blueprint.hp,
          evasion: blueprint.eva,
          crit: blueprint.crit,
          tradeMinValue,
          tradeMaxValue,
          worker1: blueprint.worker1,
          worker1Level: blueprint.w1BuildingReq,
          worker2: blueprint.worker2,
          worker2Level: blueprint.w2BuildingReq,
          worker3: blueprint.worker3,
          worker3Level: blueprint.w3BuildingReq,
          resource1: blueprint.resource1,
          resource1Qty: blueprint.r1Qty,
          resource2: blueprint.resource2,
          resource2Qty: blueprint.r2Qty,
          resource3: blueprint.resource3,
          resource3Qty: blueprint.r3Qty,
          component1: blueprint.component1,
          component1Qty: blueprint.c1Qty,
          component2: blueprint.component2,
          component2Qty: blueprint.c2Qty,
          element: blueprint.elementAffinity,
          spirit: blueprint.spiritAffinity,
          discountEnergy: blueprint.discount,
          surchargeEnergy: blueprint.surcharge,
          suggestEnergy: blueprint.suggest,
          speedupEnergy: blueprint.speedup,
          isTitanItem: blueprint.isTitanItem,
        };
      })
      .filter((item) => item !== null);

    allItems.push(...items);
  }

  if (allItems.length > 0) {
    await db
      .insert(blueprintsSchema)
      .values(allItems)
      .onConflictDoUpdate({
        target: [blueprintsSchema.id],
        set: {
          name: sql.raw(`excluded.${blueprintsSchema.name.name}`),
          category: sql.raw(`excluded.${blueprintsSchema.category.name}`),
          image: sql.raw(`excluded.${blueprintsSchema.image.name}`),
          type: sql.raw(`excluded.${blueprintsSchema.type.name}`),
          subtype: sql.raw(`excluded.${blueprintsSchema.subtype.name}`),
          level: sql.raw(`excluded.${blueprintsSchema.level.name}`),
          tier: sql.raw(`excluded.${blueprintsSchema.tier.name}`),
          subtier: sql.raw(`excluded.${blueprintsSchema.subtier.name}`),
          experience: sql.raw(`excluded.${blueprintsSchema.experience.name}`),
          craftExperience: sql.raw(
            `excluded.${blueprintsSchema.craftExperience.name}`,
          ),
          value: sql.raw(`excluded.${blueprintsSchema.value.name}`),
          favor: sql.raw(`excluded.${blueprintsSchema.favor.name}`),
          time: sql.raw(`excluded.${blueprintsSchema.time.name}`),
          attack: sql.raw(`excluded.${blueprintsSchema.attack.name}`),
          defence: sql.raw(`excluded.${blueprintsSchema.defence.name}`),
          health: sql.raw(`excluded.${blueprintsSchema.health.name}`),
          evasion: sql.raw(`excluded.${blueprintsSchema.evasion.name}`),
          crit: sql.raw(`excluded.${blueprintsSchema.crit.name}`),
          tradeMinValue: sql.raw(
            `excluded.${blueprintsSchema.tradeMinValue.name}`,
          ),
          tradeMaxValue: sql.raw(
            `excluded.${blueprintsSchema.tradeMaxValue.name}`,
          ),
          worker1: sql.raw(`excluded.${blueprintsSchema.worker1.name}`),
          worker1Level: sql.raw(
            `excluded.${blueprintsSchema.worker1Level.name}`,
          ),
          worker2: sql.raw(`excluded.${blueprintsSchema.worker2.name}`),
          worker2Level: sql.raw(
            `excluded.${blueprintsSchema.worker2Level.name}`,
          ),
          worker3: sql.raw(`excluded.${blueprintsSchema.worker3.name}`),
          worker3Level: sql.raw(
            `excluded.${blueprintsSchema.worker3Level.name}`,
          ),
          resource1: sql.raw(`excluded.${blueprintsSchema.resource1.name}`),
          resource1Qty: sql.raw(
            `excluded.${blueprintsSchema.resource1Qty.name}`,
          ),
          resource2: sql.raw(`excluded.${blueprintsSchema.resource2.name}`),
          resource2Qty: sql.raw(
            `excluded.${blueprintsSchema.resource2Qty.name}`,
          ),
          resource3: sql.raw(`excluded.${blueprintsSchema.resource3.name}`),
          resource3Qty: sql.raw(
            `excluded.${blueprintsSchema.resource3Qty.name}`,
          ),
          component1: sql.raw(`excluded.${blueprintsSchema.component1.name}`),
          component1Qty: sql.raw(
            `excluded.${blueprintsSchema.component1Qty.name}`,
          ),
          component2: sql.raw(`excluded.${blueprintsSchema.component2.name}`),
          component2Qty: sql.raw(
            `excluded.${blueprintsSchema.component2Qty.name}`,
          ),
          element: sql.raw(`excluded.${blueprintsSchema.element.name}`),
          spirit: sql.raw(`excluded.${blueprintsSchema.spirit.name}`),
          discountEnergy: sql.raw(
            `excluded.${blueprintsSchema.discountEnergy.name}`,
          ),
          surchargeEnergy: sql.raw(
            `excluded.${blueprintsSchema.surchargeEnergy.name}`,
          ),
          suggestEnergy: sql.raw(
            `excluded.${blueprintsSchema.suggestEnergy.name}`,
          ),
          speedupEnergy: sql.raw(
            `excluded.${blueprintsSchema.speedupEnergy.name}`,
          ),
          isTitanItem: sql.raw(`excluded.${blueprintsSchema.isTitanItem.name}`),
        },
      });
  }

  return success;
}

async function getBlueprints(
  category: keyof typeof blueprintCategories,
  type: string,
): Promise<
  [Map<string, string>, (Blueprint & { category: string })[]] | [null, null]
> {
  try {
    const url = `https://playshoptitans.com/_next/data/geOpYvYw1ehVXj0BsqjXo/en/blueprints/stones/${type}.json?category=${category}&type=${type}`;

    const response = await fetch(url, { cache: "no-store" });

    const {
      pageProps: { texts, items },
    } = (await response.json()) as {
      pageProps: {
        texts: Record<string, string>;
        items?: (Blueprint & { category: string })[];
      };
    };

    if (!texts || !items) {
      return [null, null];
    }

    items.forEach((item) => {
      item.category = category;

      if (category === "enchantments") {
        item.type = type;
      }
    });

    return [new Map(Object.entries(texts)), items];
  } catch {
    return [null, null];
  }
}
