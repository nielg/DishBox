import RecipesRepository from "@/repository/recipesRepository";
import type {
  CreateRecipeInput,
  RecipeMetaDataResponse,
  RecipeResponse,
} from "@/types/recipe/recipe.schemas";

async function getRecipesMetaData(
  user_id: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipesMetaDataByUserId(user_id);
}

async function addRecipe(body: CreateRecipeInput): Promise<RecipeResponse> {
  const createdDataRecipe =
    await RecipesRepository.createRecipeWithImages(body);

  return createdDataRecipe;
}

async function getPublickRecipesMetaData(): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getPublickRecipesMetaData();
}

async function getPublickVeganRecipesMetaData(): Promise<
  RecipeMetaDataResponse[]
> {
  return RecipesRepository.getPublickVeganRecipesMetaData();
}

const recipeService = {
  addRecipe,
  getRecipesMetaData,
  getPublickRecipesMetaData,
  getPublickVeganRecipesMetaData,
};

export default recipeService;
