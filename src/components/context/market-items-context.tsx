"use client";

import { type Item } from "~/shop-titans/types";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import lzString from "lz-string";
import {
  blueprintCategories,
  blueprintTypes,
  gradeValueMultipliers,
} from "~/shop-titans/data/enums";
import { roundNumber } from "~/lib/formatter";

export type ReferenceId = `${string}.${
  | "normal"
  | "superior"
  | "flawless"
  | "epic"
  | "legendary"}`;

type MarketItem = Omit<Item, "tradeMinMaxValue"> & {
  referenceId: ReferenceId;
  grade: "normal" | "superior" | "flawless" | "epic" | "legendary";
  typeName: string;
  category: string;
  name: string;
  description: string;
  minPrice?: number;
  maxPrice?: number;
};

export type MarketItemsContextType = {
  items: MarketItem[];
  itemLookup: Record<ReferenceId, number>;
  isLoadingItems: boolean;
};

export const MarketItemsContext =
  React.createContext<MarketItemsContextType | null>(null);

export function MarketItemsProvider(props: React.HTMLAttributes<HTMLElement>) {
  const [language, setLanguage] = React.useState("en");

  React.useEffect(() => {
    if (navigator.language) {
      setLanguage(navigator.language.slice(0, 2).toLowerCase());
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["market.items", language],
    queryFn: async () => await fetchMarketItems(language),
  });

  const itemLookup = React.useMemo(() => {
    const lookup: Record<ReferenceId, number> = {};
    if (!data) {
      return lookup;
    }

    for (let i = 0; i < data.length ?? 0; i++) {
      lookup[data[i]!.referenceId] = i;
    }

    return lookup;
  }, [data]);

  return (
    <MarketItemsContext.Provider
      {...props}
      value={{ items: data ?? [], itemLookup, isLoadingItems: isLoading }}
    />
  );
}

async function fetchMarketItems(language: string): Promise<MarketItem[]> {
  const cachedItems = await localforage.getItem(`market.items.${language}`);

  if (cachedItems) {
    return JSON.parse(
      lzString.decompress(cachedItems as string),
    ) as MarketItem[];
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

  const itemList: MarketItem[] = [];

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
      value: item.value,
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
      value: roundNumber(baseItem.value * gradeValueMultipliers.superior),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers.superior),
      minPrice: superiorMinPrice,
      maxPrice: superiorMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.flawless`,
      grade: "flawless",
      value: roundNumber(baseItem.value * gradeValueMultipliers.flawless),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers.flawless),
      minPrice: flawlessMinPrice,
      maxPrice: flawlessMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.epic`,
      grade: "epic",
      value: roundNumber(baseItem.value * gradeValueMultipliers.epic),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers.epic),
      minPrice: epicMinPrice,
      maxPrice: epicMaxPrice,
    });

    itemList.push({
      ...baseItem,
      referenceId: `${key}.legendary`,
      grade: "legendary",
      value: roundNumber(baseItem.value * gradeValueMultipliers.legendary),
      xp: roundNumber(baseItem.xp * gradeValueMultipliers.legendary),
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

  await localforage.setItem(
    `market.items.${language}`,
    lzString.compress(JSON.stringify(itemList)),
  );

  return itemList;
}
