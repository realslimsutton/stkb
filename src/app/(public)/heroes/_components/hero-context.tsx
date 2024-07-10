"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays, differenceInMinutes } from "date-fns";
import { type InferSelectModel } from "drizzle-orm";
import * as React from "react";
import { toast } from "sonner";
import { type blueprints } from "~/server/db/schema";
import { type Adventurer } from "~/types";

interface AdventurerWithItems extends Omit<Adventurer, "items"> {
  items: (InferSelectModel<typeof blueprints> & { tag1: string | null })[];
}

type HeroContextType = {
  isLoading: boolean;
  heroes: AdventurerWithItems[] | null;
  heroesUpdatedAt: Date;
  refreshHeroes: () => Promise<void>;
};

export const HeroContext = React.createContext<HeroContextType | null>(null);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["heroes"],
    queryFn: async () => {
      const heroes = localStorage.getItem("heroes");
      const heroesUpdatedAtTime =
        localStorage.getItem("heroesUpdatedAt") ??
        new Date().getTime().toString();

      const heroesUpdatedAt = new Date(parseInt(heroesUpdatedAtTime));

      if (heroes && differenceInDays(new Date(), heroesUpdatedAt) < 1) {
        return {
          heroes: JSON.parse(heroes) as AdventurerWithItems[],
          heroesUpdatedAt: heroesUpdatedAt,
        };
      }

      const response = await fetch("/api/me/heroes");
      if (response.status !== 200) {
        return null;
      }

      const fetchedHeroes = (await response.json()) as AdventurerWithItems[];

      if (fetchedHeroes) {
        localStorage.setItem("heroes", JSON.stringify(fetchedHeroes));
        localStorage.setItem("heroesUpdatedAt", heroesUpdatedAtTime);
      }

      return {
        heroes: fetchedHeroes,
        heroesUpdatedAt: heroesUpdatedAt,
      };
    },
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

    localStorage.removeItem("heroes");
    localStorage.removeItem("heroesUpdatedAt");

    await queryClient.invalidateQueries({ queryKey: ["heroes"] });

    toast.success("Heroes successfully freshed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.heroesUpdatedAt]);

  return (
    <HeroContext.Provider
      value={{
        isLoading,
        heroes: data?.heroes ?? null,
        heroesUpdatedAt: data?.heroesUpdatedAt ?? new Date(),
        refreshHeroes,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}
