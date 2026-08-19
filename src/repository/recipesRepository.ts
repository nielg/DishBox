import sql from "@/lib/db";
import type {
  RecipeMetaDataResponse,
  RecipeRequest,
  RecipeResponse,
} from "@/types/recipe";

async function createRecipe(recipe: RecipeRequest): Promise<RecipeResponse> {
  let insertedRows: RecipeResponse[] | null = null;

  try {
    insertedRows = (await sql`
      INSERT INTO recipes (title, description, portions, ingredients, instructions, user_id)
      VALUES (
        ${recipe.title},
        ${recipe.description},
        ${recipe.portions},
        ${sql.json(recipe.ingredients)},
        ${sql.json(recipe.instructions)},
        ${recipe.user_id}
      )
      RETURNING id, title, description, portions, ingredients, instructions
    `) as RecipeResponse[];
  } catch (error) {
    console.error("DB: Failed to create recipe:", error);
    throw new Error("Database insertion failed");
  }

  if (!insertedRows || insertedRows.length === 0) {
    throw new Error("No recipe data returned from the database");
  }

  return insertedRows[0];
}

async function getRecipeMetaData(): Promise<RecipeMetaDataResponse[]> {
  let resultRows: RecipeMetaDataResponse[] | null = null;

  try {
    resultRows = (await sql`
      SELECT * FROM recipes
      `) as RecipeResponse[];
  } catch (error) {
    console.error("DB: Failed to fetch recipeMetaData:", error);
    throw new Error("Database fetch failed");
  }

  return resultRows;
}

async function getRecipeById(id: number): Promise<RecipeResponse> {
  let resultRows: RecipeResponse[] | null = null;

  try {
    resultRows = (await sql`
      SELECT id, title, description, portions, ingredients, instructions
      FROM recipes
      WHERE id = ${id}
      `) as RecipeResponse[];
  } catch (error) {
    console.error("DB: Failed to fetch recipe:", error);
    throw new Error("Database fetch failed");
  }

  if (!resultRows || resultRows.length === 0) {
    throw new Error(`No recipe found with id: ${id}`);
  }

  return resultRows[0];
}

async function deleteRecipeById(id: number): Promise<string> {
  try {
    await sql`
      DELETE
      FROM recipes
      WHERE id = ${id}
      `;
  } catch (error) {
    console.error("DB: Failed to delete recipe:", error);
    throw new Error("Database delete failed");
  }

  return `Succesfully delete recipe ${id}`;
}
const RecipesService = {
  createRecipe,
  getRecipeMetaData,
  getRecipeById,
  deleteRecipeById,
};

export default RecipesService;
