import RecipesRepository from "@/repository/recipesRepository";
import type { AstroCookies } from "astro";
import type { RecipeResponse } from "@/types/recipe";
import { verifyAuthToken } from "..";
import type { AuthUser } from "@/types/user";

export default async function addRecipe(
  body: any,
  cookies: AstroCookies,
): Promise<RecipeResponse> {
  const decoded_jwt: AuthUser = verifyAuthToken(cookies);
  console.log(decoded_jwt);

  const createdDataRecipe = await RecipesRepository.createRecipe({
    ...body,
    user_id: decoded_jwt.id,
  });

  return createdDataRecipe;
}
