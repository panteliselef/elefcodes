import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  site: "https://elef.codes",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
  }),
});
