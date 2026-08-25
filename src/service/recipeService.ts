import RecipesRepository from "@/repository/recipesRepository";
import type { RecipeResponse } from "@/types/recipe";
import type { CreateRecipeInput } from "@/pages/api/recipe/addRecipe";

async function addRecipe(body: CreateRecipeInput): Promise<RecipeResponse> {
  const createdDataRecipe = await RecipesRepository.createRecipe(body);

  return createdDataRecipe;
}

const recipeService = {
  addRecipe,
};

export default recipeService;
