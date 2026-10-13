import { getRecipeById, getRecipeMetadata } from "@/repository/recipes/queries";
import {
  createRecipeWithImages,
  deleteRecipeById,
  updateRecipe,
} from "@/repository/recipes/mutations";
import { deleteRecipeImage } from "@/repository/recipes/images";

const RecipesService = {
  getRecipeById,
  deleteRecipeById,
  createRecipeWithImages,
  updateRecipe,
  deleteRecipeImage,
  getRecipeMetadata,
};

export default RecipesService;
