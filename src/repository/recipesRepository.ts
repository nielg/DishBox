import sql from "@/lib/db";
import {
  RecipeMetaDataResponseSchema,
  type RecipeMetaDataResponse,
  RecipeResponseSchema,
  type RecipeResponse,
  type CreateRecipeInput,
} from "@/types/recipe/recipe.schemas";
import { z } from "astro/zod";

const recipeMetaDataSelect = sql`
  SELECT DISTINCT ON (recipes.id)
    recipes.id,
    recipes.title,
    recipes.description,
    recipes.portions,
    recipes.public,
    recipes.vegan,
    recipe_images.image_url AS imgurl
  FROM recipes
  LEFT JOIN recipe_images
    ON recipes.id = recipe_images.recipe_id
`;

async function createRecipeWithImages(
  recipe: CreateRecipeInput,
): Promise<RecipeResponse> {
  return await sql.begin(async (tx) => {
    const [createdRecipe] = await tx<RecipeResponse[]>`
      INSERT INTO recipes (
        title,
        description,
        portions,
        ingredients,
        instructions,
        user_id,
        public,
        vegan
      )
      VALUES (
        ${recipe.title},
        ${recipe.description},
        ${recipe.portions},
        ${sql.json(recipe.ingredients)},
        ${sql.json(recipe.instructions)},
        ${recipe.user_id},
        ${recipe.public},
        ${recipe.vegan}
      )
      RETURNING id, title, description, portions, ingredients, instructions, public, vegan
    `;

    if (!createdRecipe) {
      throw new Error("Failed to create recipe");
    }

    if (recipe.imgurls && recipe.imgurls.length > 0) {
      await Promise.all(
        recipe.imgurls.map(
          (imageUrl) => tx`
            INSERT INTO recipe_images (recipe_id, image_url)
            VALUES (${createdRecipe.id}, ${imageUrl})
          `,
        ),
      );
    }

    return createdRecipe;
  });
}

async function createRecipe(
  recipe: CreateRecipeInput,
): Promise<RecipeResponse> {
  let insertedRows: RecipeResponse[] | null = null;

  try {
    insertedRows = (await sql`
      INSERT INTO recipes (title, description, portions, ingredients, instructions, user_id, public, vegan)
      VALUES (
        ${recipe.title},
        ${recipe.description},
        ${recipe.portions},
        ${sql.json(recipe.ingredients)},
        ${sql.json(recipe.instructions)},
        ${recipe.user_id},
        ${recipe.public},
        ${recipe.vegan}
      )
      RETURNING id, title, description, portions, ingredients, instructions, public, vegan
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

async function getRecipesMetaDataByUserId(
  user_id: number,
): Promise<RecipeMetaDataResponse[]> {
  try {
    const rows = await sql`
      ${recipeMetaDataSelect}
      WHERE recipes.user_id = ${user_id}
      ORDER BY recipes.id, recipe_images.created_at DESC
    `;
    console.log("Fetched recipeMetaData rows:", rows);
    const result = z.array(RecipeMetaDataResponseSchema).parse(rows);
    console.log("Parsed recipeMetaData result:", result);
    return result;
  } catch (error) {
    console.error("DB: Failed to fetch recipeMetaData:", error);
    throw new Error("Database fetch failed");
  }
}

async function getRecipeById(id: number): Promise<RecipeResponse> {
  let resultRows: RecipeResponse[] | null = null;

  try {
    resultRows = (await sql`
      SELECT recipes.id,
        recipes.title,
        recipes.description,
        recipes.portions,
        recipes.ingredients,
        recipes.instructions,
        recipes.public,
        recipes.vegan,
        COALESCE(
          ARRAY_AGG(recipe_images.image_url)
            FILTER (WHERE recipe_images.image_url IS NOT NULL),
          '{}'
        ) AS imgurls
      FROM recipes
      LEFT JOIN recipe_images ON recipes.id = recipe_images.recipe_id
      WHERE recipes.id = ${id}
      GROUP BY recipes.id
      `) as RecipeResponse[];
  } catch (error) {
    console.error("DB: Failed to fetch recipe:", error);
    throw new Error("Database fetch failed");
  }

  if (!resultRows || resultRows.length === 0) {
    throw new Error(`No recipe found with id: ${id}`);
  }
  console.log("Fetched recipe rows:", resultRows);
  const result = RecipeResponseSchema.parse(resultRows[0]);
  console.log("Parsed recipe result:", result);
  return result;
}

async function deleteRecipeById(id: number): Promise<string> {
  let result;
  try {
    result = await sql`
      DELETE
      FROM recipes
      WHERE id = ${id}
      `;
  } catch (error) {
    console.error("DB: Failed to delete recipe:", error);
    throw new Error("Database delete failed");
  }

  if (result.count === 0) {
    throw new Error(`Recipe with ID ${id} not found`);
  }

  return `Succesfully delete recipe ${id}`;
}

async function getPublickRecipesMetaData(): Promise<RecipeMetaDataResponse[]> {
  try {
    const rows = await sql`
      ${recipeMetaDataSelect}
      WHERE recipes.public = true
      ORDER BY recipes.id, recipe_images.created_at DESC
    `;
    return z.array(RecipeMetaDataResponseSchema).parse(rows);
  } catch (error) {
    console.error("DB: Failed to fetch public recipes:", error);
    throw new Error("Database fetch failed");
  }
}

async function getPublicVeganRecipesMetaData(): Promise<
  RecipeMetaDataResponse[]
> {
  try {
    const rows = await sql`
      ${recipeMetaDataSelect}
      WHERE vegan = true AND public = true
      ORDER BY recipes.id, recipe_images.created_at DESC
    `;
    return z.array(RecipeMetaDataResponseSchema).parse(rows);
  } catch (error) {
    console.error("DB: Failed to fetch public vegan recipes:", error);
    throw new Error("Database fetch failed");
  }
}

const RecipesService = {
  createRecipe,
  getRecipesMetaDataByUserId,
  getRecipeById,
  deleteRecipeById,
  getPublickRecipesMetaData,
  getPublicVeganRecipesMetaData,
  createRecipeWithImages,
};

export default RecipesService;
