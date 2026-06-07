import { number } from "astro:schema";

export type RecipeDateType = {
  title: string;
  description: string;
  slug: string;
};

export type RecipeRequest = {
  title: string;
  description: string;
  p_count: number;
  ingredients: string;
  instructions: string;
};
