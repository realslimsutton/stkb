import { type FlagDefinitionsType } from "@vercel/flags";

export const definitions: FlagDefinitionsType = {
  "market.import": {
    description: "Toggle market import functionality",
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
  },
};
