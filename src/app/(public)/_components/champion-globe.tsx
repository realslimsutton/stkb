"use client";

import Image from "next/image";
import { Cloud, type ICloud } from "react-icon-cloud";
import { guid } from "react-icon-cloud/src/utils/guid";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    dragControl: false,
  },
};

export default function ChampionGlobe() {
  return (
    <Cloud id="champions-globe" {...cloudProps}>
      <ChampionIcon name="wood" title="Wood" />
      <ChampionIcon name="wizard" title="Wizard" />
      <ChampionIcon name="tavern" title="Tavern" />
      <ChampionIcon name="tailor" title="Tailor" />
      <ChampionIcon name="sundragon" title="Sundragon" />
      <ChampionIcon name="steel" title="Steel" />
      <ChampionIcon name="priest" title="Priest" />
      <ChampionIcon name="oils" title="Oils" />
      <ChampionIcon name="moondragon" title="Moondragon" />
      <ChampionIcon name="master" title="Master" />
      <ChampionIcon name="mana" title="Mana" />
      <ChampionIcon name="leather" title="Leather" />
      <ChampionIcon name="king" title="King" />
      <ChampionIcon name="jeweler" title="Jeweler" />
      <ChampionIcon name="ironwood" title="Ironwood" />
      <ChampionIcon name="iron" title="Iron" />
      <ChampionIcon name="inn" title="Inn" />
      <ChampionIcon name="herbs" title="Herbs" />
      <ChampionIcon name="herbalist" title="Herbalist" />
      <ChampionIcon name="gems" title="Gems" />
      <ChampionIcon name="fabric" title="Fabric" />
      <ChampionIcon name="engineer" title="Engineer" />
      <ChampionIcon name="elven" title="Elven" />
      <ChampionIcon name="elderowen" title="Elderowen" />
      <ChampionIcon name="cook" title="Cook" />
      <ChampionIcon name="carpenter" title="Carpenter" />
      <ChampionIcon name="blacksmith" title="Blacksmith" />
      <ChampionIcon name="baker" title="Baker" />
      <ChampionIcon name="argon" title="Argon" />
      <ChampionIcon name="academy" title="Academy" />
      <ChampionIcon name="essence" title="Essence" />
      <ChampionIcon name="bard" title="Bard" />
    </Cloud>
  );
}

function ChampionIcon({ name, title }: { name: string; title: string }) {
  return (
    <a key={guid()} title={title} className="cursor-pointer">
      <Image
        src={`https://f9w4sqozvcfkizrn.public.blob.vercel-storage.com/champions/${name}.webp`}
        alt={title}
        height="42"
        width="42"
        priority
      />
    </a>
  );
}
