"use client";

import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import lzString from "lz-string";
import * as React from "react";
import { type MarketPrice } from "~/shop-titans/types";
import { type ReferenceId } from "./market-items-context";

export type MarketPricesContextType = {
  prices: Map<
    ReferenceId,
    {
      offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
      request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
    }
  >;
  isLoadingPrices: boolean;
};

export const MarketPricesContext =
  React.createContext<MarketPricesContextType | null>(null);

export function MarketPricesProvider({
  debug,
  ...props
}: React.HTMLAttributes<HTMLElement> & { debug: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["market.prices", debug],
    queryFn: async () => await fetchMarketPrices(debug),
  });

  return (
    <MarketPricesContext.Provider
      {...props}
      value={{
        prices: data ?? (new Map() as MarketPricesContextType["prices"]),
        isLoadingPrices: isLoading,
      }}
    />
  );
}

async function fetchMarketPrices(
  debug: boolean,
): Promise<MarketPricesContextType["prices"]> {
  if (debug) {
    const cachedPrices = await localforage.getItem("market.prices");

    if (cachedPrices) {
      return new Map(
        JSON.parse(
          lzString.decompress(cachedPrices as string),
        ) as MarketPricesContextType["prices"],
      );
    }
  }

  const response = await fetch("/api/smartytitans/api/item/last/all", {
    cache: "no-store",
  });

  const data = ((await response.json()) as { data: MarketPrice[] | null }).data;
  if (!data) {
    return new Map();
  }

  const itemMap: MarketPricesContextType["prices"] = new Map();

  for (const item of data) {
    const referenceId = `${item.uid}.${item.tag1 ?? "normal"}` as ReferenceId;
    const updatedAt = new Date(item.updatedAt);

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
    await localforage.setItem(
      "market.prices",
      lzString.compress(JSON.stringify(Array.from(itemMap.entries()))),
    );
  }

  return itemMap;
}
