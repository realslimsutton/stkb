import { type MarketItemsContextType } from "~/components/context/market-items-context";
import { type MarketPrice } from "../types";

export function getShopArbitrage(
  item: MarketItemsContextType["items"][0],
  prices?: {
    offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
    request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
  },
): number | undefined {
  if (!prices) {
    return undefined;
  }

  if (!prices.offer || prices.offer.goldQty === 0) {
    return undefined;
  }

  return item.value - (prices.offer.goldPrice ?? 0);
}

export function getMarketArbitrage(prices?: {
  offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
  request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
}) {
  if (!prices) {
    return undefined;
  }

  if (!prices.offer || !prices.request) {
    return undefined;
  }

  if (prices.offer.goldPrice === null || prices.request.goldPrice === null) {
    return undefined;
  }

  return (prices.request.goldPrice ?? 0) - (prices.offer.goldPrice ?? 0);
}

export function getFusionArbitrage(
  prices?: {
    offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
    request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
  },
  comparisonPrices?: {
    offer?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
    request?: Omit<MarketPrice, "updatedAt"> & { updatedAt: Date };
  },
): number | undefined {
  if ((!prices?.request && !prices?.offer) || !comparisonPrices?.offer) {
    return undefined;
  }

  // Needs 5 items to fuse into a higher tier
  if (comparisonPrices.offer.gemsQty < 5) {
    return undefined;
  }

  const comparisonOfferPrice = (comparisonPrices.offer.gemsPrice ?? 0) * 5;

  return (
    (prices?.request?.gemsPrice ?? prices?.offer?.gemsPrice ?? 0) -
    comparisonOfferPrice
  );
}
