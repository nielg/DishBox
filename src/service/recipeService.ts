import RecipesRepository from "@/repository/recipesRepository";
import type { AstroCookies } from "astro";
import type { RecipeResponse } from "@/types/recipe";
import { verifyAuthToken } from ".";
import type { AuthUser } from "@/types/user";
import type { createRecipeInput } from "@/pages/api/recipe/addRecipe";

async function addRecipe(
  body: createRecipeInput,
  cookies: AstroCookies,
): Promise<RecipeResponse> {
  const decoded: AuthUser = verifyAuthToken(cookies);

  const createdDataRecipe = await RecipesRepository.createRecipe({
    ...body,
    user_id: decoded.id,
  });

  return createdDataRecipe;
}

const recipeService = {
  addRecipe,
};

export default recipeService;
