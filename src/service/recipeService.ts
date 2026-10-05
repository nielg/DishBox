import sql from "@/lib/db";
import RecipesRepository from "@/repository/recipesRepository";
import UserRepository from "@/repository/userRepository";
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
    user_id,
  );
}

async function searchRecipesMetaData(query: string, user_id?: number) {
  if (user_id) {
    return RecipesRepository.searchRecipesMetaData(
      query,
      sql`WHERE recipes.user_id = ${user_id}`,
      user_id,
    );
  }
  return RecipesRepository.searchRecipesMetaData(
    query,
    sql`WHERE recipes.public = true`,
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

async function getPublickRecipesMetaData(
  user_id?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.public = true`,
    user_id,
  );
}

async function deleteRecipeImages(user_id: string, recipeImages: string[]) {
  return RecipesRepository.deleteRecipeImage(user_id, recipeImages);
}

async function getPublickVeganRecipesMetaData(
  user_id?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.public = true AND recipes.vegan = true`,
    user_id,
  );
}

async function getUserFavoriteRecipesMetaData(
  user_id: number,
): Promise<RecipeMetaDataResponse[]> {
  const recipes_ids =
    await UserRepository.getAllUserFavoriteRecipesIds(user_id);

  if (recipes_ids.length === 0) {
    return [];
  }

  return RecipesRepository.getRecipesMetaDataWithWhere(
    sql`WHERE recipes.id IN ${sql(recipes_ids)}`,
    user_id,
  );
}

const recipeService = {
  createRecipe,
  getRecipesMetaDataByUserid,
  getPublickRecipesMetaData,
  getPublickVeganRecipesMetaData,
  updateRecipe,
  deleteRecipeImages,
  getUserFavoriteRecipesMetaData,
  searchRecipesMetaData,
};

export default recipeService;
