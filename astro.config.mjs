import { defineConfig, envField } from "astro/config";
import icon from "astro-icon";

import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [icon(), react()],
  env: {
    schema: {
      COOKIE_NAME: envField.string({
        context: "server",
        access: "public",
        default: "session_cookie",
      }),
      COOKIE_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      COOKIE_SECURE: envField.boolean({
        context: "server",
        access: "public",
        default: true,
      }),
      MAX_AGE: envField.number({
        context: "server",
        access: "public",
        default: 604800,
      }),
    },
  },
});
