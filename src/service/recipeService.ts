import sql from "@/lib/db";
import RecipesRepository from "@/repository/recipesRepository";
import UserRepository from "@/repository/userRepository";
import type {
  CreateRecipeInput,
  RecipeMetaDataResponse,
  RecipeResponse,
} from "@/types/recipe/recipe.schemas";

async function getRecipesMetaDataByUserid(
  userId: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({ userId });
}

async function searchRecipesMetaData(
  query: string,
  userId?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({ query, userId });
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

async function getPublickRecipesMetaData(
  userId?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({ publicRecipes: true, userId });
}

async function deleteRecipeImages(user_id: string, recipeImages: string[]) {
  return RecipesRepository.deleteRecipeImage(user_id, recipeImages);
}

async function getUserFavoriteRecipesMetaData(
  userId: number,
): Promise<RecipeMetaDataResponse[]> {
  const recipes_ids = await UserRepository.getAllUserFavoriteRecipesIds(userId);

  if (recipes_ids.length === 0) {
    return [];
  }
  console.log("recipes_ids", recipes_ids);
  return RecipesRepository.getRecipeMetadata({
    userId,
    recipes_ids,
    publicRecipes: true,
  });
}

const recipeService = {
  createRecipe,
  getRecipesMetaDataByUserid,
  getPublickRecipesMetaData,
  updateRecipe,
  deleteRecipeImages,
  getUserFavoriteRecipesMetaData,
  searchRecipesMetaData,
};

export default recipeService;
