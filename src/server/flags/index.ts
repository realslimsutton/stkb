import { unstable_flag as flag } from "@vercel/flags/next";

export const enableMarketImport = flag({
  key: "market.import",
  decide: () => false,
});
