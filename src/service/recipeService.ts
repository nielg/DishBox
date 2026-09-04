import sql from "@/lib/db";
import RecipesRepository from "@/repository/recipesRepository";
import type {
  CreateRecipeInput,
  RecipeMetaDataResponse,
  RecipeResponse,
} from "@/types/recipe/recipe.schemas";

async function getRecipesMetaDataByUserid(
  user_id: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.user_id = ${user_id}`,
  );
}

async function createRecipe(body: CreateRecipeInput): Promise<RecipeResponse> {
  const createdDataRecipe =
    await RecipesRepository.createRecipeWithImages(body);

  return createdDataRecipe;
}

async function updateRecipe(
  recipeId: number,
  body: CreateRecipeInput,
): Promise<RecipeResponse> {
  const updatedRecipe = await RecipesRepository.updateRecipe(recipeId, body);
  return updatedRecipe;
}

async function getPublickRecipesMetaData(): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.public = true`,
  );
}

async function getPublickVeganRecipesMetaData(): Promise<
  RecipeMetaDataResponse[]
> {
  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.public = true AND recipes.vegan = true`,
  );
}

const recipeService = {
  createRecipe,
  getRecipesMetaData: getRecipesMetaDataByUserid,
  getPublickRecipesMetaData,
  getPublickVeganRecipesMetaData,
  updateRecipe,
};

export default recipeService;
