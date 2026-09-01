import { z } from "zod";

export const CreateRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description cannot be empty"),
  portions: z
    .number()
    .int("Portions must be an integer")
    .positive("Portions must be a positive number"),
  ingredients: z
    .array(z.string().min(1, "Ingredients cannot be empty"))
    .min(1, "At least one ingredients required"),
  instructions: z
    .array(z.string().min(1, "Instructions cannot be empty"))
    .min(1, "At least one instruction required"),
  public: z.boolean(),
  vegan: z.boolean(),
  imgURLs: z.array(z.string()).optional(),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema> & {
  user_id: number;
};

export type CreateRecipeBody = z.infer<typeof CreateRecipeSchema>;

export const RecipeMetaDataResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  portions: z.number().int().positive(),
  public: z.boolean(),
  vegan: z.boolean(),
});

export type RecipeMetaDataResponse = z.infer<
  typeof RecipeMetaDataResponseSchema
>;

export const RecipeResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  portions: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  public: z.boolean(),
  vegan: z.boolean(),
});

export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
