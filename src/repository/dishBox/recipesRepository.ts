import {
  getRecipeById,
  getRecipeMetadata,
} from "@/repository/dishBox/recipes/queries";
import {
  createRecipeWithImages,
  deleteRecipeById,
  updateRecipe,
} from "@/repository/dishBox/recipes/mutations";
import { deleteRecipeImage } from "@/repository/dishBox/recipes/images";

const RecipesService = {
  getRecipeById,
  deleteRecipeById,
  createRecipeWithImages,
  updateRecipe,
  deleteRecipeImage,
  getRecipeMetadata,
};

export default RecipesService;
