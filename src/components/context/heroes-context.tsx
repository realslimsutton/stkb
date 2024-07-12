"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays, differenceInMinutes } from "date-fns";
import localforage from "localforage";
import * as React from "react";
import { toast } from "sonner";
import { type Adventurer } from "~/types";

export type HeroesContextType = {
  heroes: Adventurer[];
  updatedHeroesAt: Date;
  isLoadingHeroes: boolean;
  refreshHeroes: () => Promise<void>;
};

export const HeroesContext = React.createContext<HeroesContextType | null>(
  null,
);

export function HeroesProvider(props: React.HTMLAttributes<HTMLElement>) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["heroes"],
    queryFn: fetchHeroes,
  });

  const refreshHeroes = React.useCallback(async () => {
    if (!data?.heroesUpdatedAt) {
      return;
    }

    const difference = differenceInMinutes(new Date(), data.heroesUpdatedAt);
    if (difference < 5) {
      toast.warning(`Please wait ${5 - difference} minutes before refreshing`);
      return;
    }

    await localforage.removeItem("heroes");
    await localforage.removeItem("heroesUpdatedAt");

    await queryClient.invalidateQueries({ queryKey: ["heroes"] });

    toast.success("Heroes successfully freshed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.heroesUpdatedAt]);

  return (
    <HeroesContext.Provider
      {...props}
      value={{
        heroes: data?.heroes ?? [],
        updatedHeroesAt: data?.heroesUpdatedAt ?? new Date(),
        isLoadingHeroes: isLoading,
        refreshHeroes,
      }}
    />
  );
}

async function fetchHeroes() {
  const heroes = await localforage.getItem<string>("heroes");
  const heroesUpdatedAtTime =
    (await localforage.getItem<string>("heroes.updatedAt")) ??
    new Date().getTime().toString();

  const heroesUpdatedAt = new Date(parseInt(heroesUpdatedAtTime));

  if (heroes && differenceInDays(new Date(), heroesUpdatedAt) < 1) {
    return {
      heroes: JSON.parse(heroes) as Adventurer[],
      heroesUpdatedAt: heroesUpdatedAt,
    };
  }

  const response = await fetch("/api/me/heroes");
  if (response.status !== 200) {
    return null;
  }

  const fetchedHeroes = (await response.json()) as Adventurer[];

  if (fetchedHeroes) {
    await localforage.setItem("heroes", JSON.stringify(fetchedHeroes));
    await localforage.setItem("heroes.updatedAt", heroesUpdatedAtTime);
  }

  return {
    heroes: fetchedHeroes,
    heroesUpdatedAt: heroesUpdatedAt,
  };
}
