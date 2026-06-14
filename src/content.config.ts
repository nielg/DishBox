import { defineCollection } from "astro:content";

import { glob, file } from "astro/loaders";

import { z } from "astro/zod";

// 4. Define a `loader` and `schema` for each collection
const recipe = defineCollection({
  loader: glob({ base: "./src/data/recipes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
  }),
});

export const collections = { recipe };
