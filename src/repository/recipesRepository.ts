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

async function updateRecipe(
  id: number,
  recipe: Partial<CreateRecipeInput>,
): Promise<RecipeResponse> {
  return await sql.begin(async (tx) => {
    const [updatedRecipe] = await tx<RecipeResponse[]>`
      UPDATE recipes
      SET
        title = COALESCE(${recipe.title ?? null}, title),
        description = COALESCE(${recipe.description ?? null}, description),
        portions = COALESCE(${recipe.portions ?? null}, portions),
        public = COALESCE(${recipe.public ?? null}, public),
        vegan = COALESCE(${recipe.vegan ?? null}, vegan)
        ingredients = COALESCE(
          ${recipe.ingredients !== undefined ? sql.json(recipe.ingredients) : null},
          recipes.ingredients
        ),
        instructions = COALESCE(
          ${recipe.instructions !== undefined ? sql.json(recipe.instructions) : null},
          recipes.instructions
        ),
      WHERE id = ${id}
      RETURNING id, title, description, portions, ingredients, instructions, public, vegan
    `;

    if (!updatedRecipe) {
      throw new Error(`Failed to update recipe with ID ${id}`);
    }

    return updatedRecipe;
  });
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
  const result = RecipeResponseSchema.parse(resultRows[0]);
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

async function getRecipesMetaDataWithWhere(
  where: ReturnType<typeof sql>,
): Promise<RecipeMetaDataResponse[]> {
  try {
    const rows = await sql`
      ${recipeMetaDataSelect}
      ${where}
      ORDER BY recipes.id, recipe_images.created_at DESC
    `;
    return z.array(RecipeMetaDataResponseSchema).parse(rows);
  } catch (error) {
    console.error("DB: Failed to fetch recipes with where clause:", error);
    throw new Error("Database fetch failed");
  }
}

const RecipesService = {
  getRecipeById,
  deleteRecipeById,
  getRecipesMetaDataWithWhere,
  createRecipeWithImages,
  updateRecipe,
};

export default RecipesService;
