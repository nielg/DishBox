import RecipesRepository from "@/repository/recipesRepository";
import type { AstroCookies } from "astro";
import type { RecipeResponse } from "@/types/recipe";
import { verifyAuthToken } from "..";
import type { AuthUser } from "@/types/user";

export default async function addRecipe(
  body: any,
  cookies: AstroCookies,
): Promise<RecipeResponse> {
  const decoded: AuthUser = verifyAuthToken(cookies);

  const createdDataRecipe = await RecipesRepository.createRecipe({
    ...body,
    user_id: decoded.id,
  });

  return createdDataRecipe;
}
