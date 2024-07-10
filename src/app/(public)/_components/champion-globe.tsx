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
      <ChampionIcon name="wood_head" title="Wood" />
      <ChampionIcon name="wizard_head" title="Wizard" />
      <ChampionIcon name="tavern_head" title="Tavern" />
      <ChampionIcon name="tailor_head" title="Tailor" />
      <ChampionIcon name="sundragon_head" title="Sundragon" />
      <ChampionIcon name="steel_head" title="Steel" />
      <ChampionIcon name="priest_head" title="Priest" />
      <ChampionIcon name="oils_head" title="Oils" />
      <ChampionIcon name="moondragon_head" title="Moondragon" />
      <ChampionIcon name="master_head" title="Master" />
      <ChampionIcon name="mana_head" title="Mana" />
      <ChampionIcon name="leather_head" title="Leather" />
      <ChampionIcon name="king_head" title="King" />
      <ChampionIcon name="jeweler_head" title="Jeweler" />
      <ChampionIcon name="ironwood_head" title="Ironwood" />
      <ChampionIcon name="iron_head" title="Iron" />
      <ChampionIcon name="inn_head" title="Inn" />
      <ChampionIcon name="herbs_head" title="Herbs" />
      <ChampionIcon name="herbalist_head" title="Herbalist" />
      <ChampionIcon name="gems_head" title="Gems" />
      <ChampionIcon name="fabric_head" title="Fabric" />
      <ChampionIcon name="engineer_head" title="Engineer" />
      <ChampionIcon name="elven_head" title="Elven" />
      <ChampionIcon name="elderowen_head" title="Elderowen" />
      <ChampionIcon name="cook_head" title="Cook" />
      <ChampionIcon name="carpenter_head" title="Carpenter" />
      <ChampionIcon name="blacksmith_head" title="Blacksmith" />
      <ChampionIcon name="baker_head" title="Baker" />
      <ChampionIcon name="argon_head" title="Argon" />
      <ChampionIcon name="academy_head" title="Academy" />
      <ChampionIcon name="essence_head" title="Essence" />
      <ChampionIcon name="bard_head" title="Bard" />
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
