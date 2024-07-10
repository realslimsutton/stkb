"use client";

import {
  useQueries,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";
import * as React from "react";
import { Item, MarketPrice } from "~/shop-titans/types";
import lzString from "lz-string";
import localforage from "localforage";
import { DataTableSkeleton } from "~/components/ui/datatable/skeleton";
import { roundNumber } from "~/lib/formatter";
import {
  blueprintCategories,
  blueprintTypes,
  gradeValueMultipliers,
} from "~/shop-titans/data/enums";
import { Skeleton } from "~/components/ui/skeleton";

type ReferenceId =
  `${string}.${"normal" | "superior" | "flawless" | "epic" | "legendary"}`;

export type MarketContextType = {
  items: (Omit<Item, "tradeMinMaxValue"> & {
    referenceId: ReferenceId;
    grade: "normal" | "superior" | "flawless" | "epic" | "legendary";
    typeName: string;
    category: string;
    name: string;
    description: string;
    minPrice?: number;
    maxPrice?: number;
  })[];
  marketData: {
    prices: Map<
      ReferenceId,
      {
        offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
        request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
      }
    >;
    lastUpdatedAt: Date | undefined;
  };
};

export const MarketContext = React.createContext<MarketContextType | null>(
  null,
);

export function MarketProvider({
  children,
  debug,
}: {
  children: React.ReactNode;
  debug: boolean;
}) {
  const [language, setLanguage] = React.useState("en");

  React.useEffect(() => {
    if (navigator.language) {
      setLanguage(navigator.language.slice(0, 2).toLowerCase());
    }
  });

  const [itemsQuery, pricesQuery] = useQueries({
    queries: [
      {
        queryKey: ["market.items", language],
        queryFn: async () => await fetchMarketItems(language),
      },
      {
        queryKey: ["market.data", debug],
        queryFn: async () => await fetchMarketPrices(debug),
        refetchInterval: 30000,
      },
    ],
  });

  return (
    <MarketContext.Provider
      value={{
        items: itemsQuery.data ?? [],
        marketData: {
          prices: pricesQuery.data?.prices ?? new Map(),
          lastUpdatedAt: pricesQuery.data?.lastUpdatedAt ?? undefined,
        },
      }}
    >
      {(itemsQuery.isLoading || pricesQuery.isLoading) && (
        <div className="space-y-4">
          <Skeleton className="h-[74px]" />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-[307px]" />
            ))}
          </div>

          <Skeleton className="h-16" />
        </div>
      )}

      {!itemsQuery.isLoading && !pricesQuery.isLoading && children}
    </MarketContext.Provider>
  );
}

async function fetchMarketItems(
  language: string,
): Promise<MarketContextType["items"]> {
  const cachedItems = (await localforage.getItem("market-items")) as
    | string
    | null;

  if (cachedItems) {
    return JSON.parse(lzString.decompress(cachedItems));
  }

  const translationsResponse = await fetch(
    `/api/smartytitans/assets/gameData/texts_${language}.json`,
  );

  const translations =
    (
      (await translationsResponse.json()) as {
        texts: Record<string, string>;
      }
    ).texts ?? {};

  const itemsResponse = await fetch(
    "/api/smartytitans/assets/gameData/items.json",
  );

  const items = (await itemsResponse.json()) as Record<string, Item>;

  const itemList: MarketContextType["items"] = [];

  for (const key in items) {
    const item = items[key]!;

    if (!item.tradeMinMaxValue) {
      continue;
    }

    const [
      normalMinPrice,
      superiorMinPrice,
      flawlessMinPrice,
      epicMinPrice,
      legendaryMinPrice,
      normalMaxPrice,
      superiorMaxPrice,
      flawlessMaxPrice,
      epicMaxPrice,
      legendaryMaxPrice,
    ] = item.tradeMinMaxValue.replace(";", ",").split(",").map(parseInt);

    const baseItem = {
      uid: item.uid,
      typeName: blueprintTypes[item.type as keyof typeof blueprintTypes],
      category:
        blueprintCategories[item.type as keyof typeof blueprintCategories],
      name: translations[`${key}_name`] ?? "Unknown",
      description: translations[`${key}_desc`] ?? "Unknown",
      level: item.level,
      type: item.type,
      subtype: item.subtype,
      xp: item.xp,
      craftXp: item.craftXp,
      value: roundNumber(item.value * 1.25),
      favor: item.favor,
      time: item.time,
      atk: item.atk,
      def: item.def,
      hp: item.hp,
      eva: item.eva,
      crit: item.crit,
      excl: item.excl,
      tier: item.tier,
      subtier: item.subtier,
      combo: item.combo,
      worker1: item.worker1,
      worker2: item.worker2,
      worker3: item.worker3,
      w1BuildingReq: item.w1BuildingReq,
      w2BuildingReq: item.w2BuildingReq,
      w3BuildingReq: item.w3BuildingReq,
      resource1: item.resource1,
      r1Qty: item.r1Qty,
      resource2: item.resource2,
      r2Qty: item.r2Qty,
      resource3: item.resource3,
      r3Qty: item.r3Qty,
      component1: item.component1,
      c1Qty: item.c1Qty,
      c1Tags: item.c1Tags,
      component2: item.component2,
      c2Qty: item.c2Qty,
      c2Tags: item.c2Tags,
      u1Req: item.u1Req,
      u2Req: item.u2Req,
      u3Req: item.u3Req,
      u4Req: item.u4Req,
      u5Req: item.u5Req,
      upgrade1: item.upgrade1,
      upgrade2: item.upgrade2,
      upgrade3: item.upgrade3,
      upgrade4: item.upgrade4,
      upgrade5: item.upgrade5,
      upgradeBonus: item.upgradeBonus,
      supgrade1: item.supgrade1,
      supgrade2: item.supgrade2,
      supgrade3: item.supgrade3,
      su1Cost: item.su1Cost,
      su2Cost: item.su2Cost,
      su3Cost: item.su3Cost,
      restrict: item.restrict,
      reqTags: item.reqTags,
      tagIndex: item.tagIndex,
      elements: item.elements,
      skill: item.skill,
      lTag2: item.lTag2,
      lTag3: item.lTag3,
      elementAffinity: item.elementAffinity,
      spiritAffinity: item.spiritAffinity,
      tag: item.tag,
      discount: item.discount,
      surcharge: item.surcharge,
      suggest: item.suggest,
      speedup: item.speedup,
      buyAnimIdOverride: item.buyAnimIdOverride,
      questAnimIdOverride: item.questAnimIdOverride,
      slotOverride: item.slotOverride,
      soundType: item.soundType,
      unlock: item.unlock,
      chest: item.chest,
      firstOfLine: item.firstOfLine,
      prohibited: item.prohibited,
      hasChinaTexture: item.hasChinaTexture,
      nonCraftable: item.nonCraftable,
      releaseAt: item.releaseAt,
      shardPrice: item.shardPrice,
      capriceDelay: item.capriceDelay,
      EnchantedItemTexturer: item.EnchantedItemTexturer,
      isTitanItem: item.isTitanItem,
    };

    if (!baseItem.typeName || !baseItem.category) {
      continue;
    }

    itemList.push({
      ...baseItem,
      referenceId: `${key}.normal`,
      grade: "normal",
      minPrice: normalMinPrice,
      maxPrice: normalMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.superior`,
      grade: "superior",
      value: roundNumber(baseItem.value * gradeValueMultipliers["superior"]),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers["superior"]),
      minPrice: superiorMinPrice,
      maxPrice: superiorMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.flawless`,
      grade: "flawless",
      value: roundNumber(baseItem.value * gradeValueMultipliers["flawless"]),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers["flawless"]),
      minPrice: flawlessMinPrice,
      maxPrice: flawlessMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.epic`,
      grade: "epic",
      value: roundNumber(baseItem.value * gradeValueMultipliers["epic"]),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers["epic"]),
      minPrice: epicMinPrice,
      maxPrice: epicMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.legendary`,
      grade: "legendary",
      value: roundNumber(baseItem.value * gradeValueMultipliers["legendary"]),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers["legendary"]),
      minPrice: legendaryMinPrice,
      maxPrice: legendaryMaxPrice,
    });
  }

  itemList.sort((a, b) => {
    if (a.tier === b.tier) {
      return b.value - a.value;
    }

    return b.tier - a.tier;
  });

  localforage.setItem(
    "market-items",
    lzString.compress(JSON.stringify(itemList)),
  );

  return itemList;
}

async function fetchMarketPrices(debug: boolean) {
  if (debug) {
    const cachedPrices = (await localforage.getItem("market-prices")) as
      | string
      | null;

    if (cachedPrices) {
      return {
        prices: new Map<
          ReferenceId,
          {
            offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
            request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
          }
        >(JSON.parse(lzString.decompress(cachedPrices))),
        lastUpdatedAt: new Date(
          (await localforage.getItem("market-prices-last-updated")) ?? 0,
        ),
      };
    }
  }

  const response = await fetch("/api/smartytitans/api/item/last/all", {
    cache: "no-store",
  });

  const data = (await response.json()).data as MarketPrice[];

  if (!data) {
    return null;
  }

  const itemMap = new Map<
    ReferenceId,
    {
      offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
      request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
    }
  >();

  let lastUpdatedAt = null;
  for (const item of data) {
    const referenceId = `${item.uid}.${item.tag1 ?? "normal"}` as ReferenceId;
    const updatedAt = new Date(item.updatedAt);

    if (lastUpdatedAt === null || updatedAt > lastUpdatedAt) {
      lastUpdatedAt = updatedAt;
    }

    const prices = itemMap.get(referenceId);
    if (!prices) {
      switch (item.tType) {
        case "o":
          itemMap.set(referenceId, {
            offer: {
              ...item,
              goldQty: item.goldQty ?? 0,
              gemsQty: item.gemsQty ?? 0,
              updatedAt,
            },
          });
          break;
        case "r":
          itemMap.set(referenceId, {
            request: {
              ...item,
              goldQty: item.goldQty ?? 0,
              gemsQty: item.gemsQty ?? 0,
              updatedAt,
            },
          });
          break;
      }
      continue;
    }

    switch (item.tType) {
      case "o":
        if (!prices.offer || updatedAt >= prices.offer.updatedAt) {
          prices.offer = {
            ...item,
            goldQty: item.goldQty ?? 0,
            gemsQty: item.gemsQty ?? 0,
            updatedAt,
          };
        }
        break;
      case "r":
        if (!prices.request || updatedAt >= prices.request.updatedAt) {
          prices.request = {
            ...item,
            goldQty: item.goldQty ?? 0,
            gemsQty: item.gemsQty ?? 0,
            updatedAt,
          };
        }
        break;
    }
  }

  if (debug) {
    localforage.setItem(
      "market-prices",
      lzString.compress(JSON.stringify(Array.from(itemMap.entries()))),
    );
    localforage.setItem(
      "market-prices-last-updated",
      lastUpdatedAt?.getTime() ?? 0,
    );
  }

  return {
    prices: itemMap,
    lastUpdatedAt: lastUpdatedAt,
  };
}
