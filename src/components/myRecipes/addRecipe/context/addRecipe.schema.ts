import { z } from "zod";

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  portions: z.number().min(1),
  instructions: z.array(z.string().trim().min(1)),
  ingredients: z.array(z.string().trim().min(1)),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
