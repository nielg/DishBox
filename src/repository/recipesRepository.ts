import sql from "@/lib/db";
import {
  RecipeMetaDataResponseSchema,
  type RecipeMetaDataResponse,
  RecipeResponseSchema,
  type RecipeResponse,
  type CreateRecipeInput,
} from "@/types/recipe/recipe.schemas";
import { z } from "astro/zod";
import { IMG_STORAGE_TYPE } from "astro:env/client";
import type postgres from "postgres";

async function replaceRecipeTags(
  tx: postgres.TransactionSql,
  recipeId: number,
  tags: string[],
): Promise<void> {
  await tx`DELETE FROM recipe_tags WHERE recipe_id = ${recipeId}`;

  if (tags.length === 0) return;

  const insertedTags = await tx<{ tag_id: number }[]>`
    INSERT INTO recipe_tags (recipe_id, tag_id)
    SELECT ${recipeId}, tags.id
    FROM tags
    WHERE tags.value = ANY(${tags}::text[])
    ON CONFLICT (recipe_id, tag_id) DO NOTHING
    RETURNING tag_id
  `;

  if (insertedTags.length !== new Set(tags).size) {
    throw new Error("One or more recipe tags are not recognized");
  }
}

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
        public
      )
      VALUES (
        ${recipe.title},
        ${recipe.description},
        ${recipe.portions},
        ${sql.json(recipe.ingredients)},
        ${sql.json(recipe.instructions)},
        ${recipe.user_id},
        ${recipe.public}
      )
      RETURNING id, title, description, portions, ingredients, instructions, public
    `;

    if (!createdRecipe) {
      throw new Error("Failed to create recipe");
    }

    await replaceRecipeTags(tx, createdRecipe.id, recipe.tags ?? []);

    if (recipe.imgurls && recipe.imgurls.length > 0) {
      await Promise.all(
        recipe.imgurls.map(
          (imageUrl) => tx`
            INSERT INTO recipe_images (recipe_id, image_url, img_storage_type)
            VALUES (${createdRecipe.id}, ${imageUrl}, ${IMG_STORAGE_TYPE})
          `,
        ),
      );
    }

    return RecipeResponseSchema.parse({
      ...createdRecipe,
      tags: recipe.tags ?? [],
    });
  });
}

async function updateRecipe(
  id: number,
  recipe: Partial<CreateRecipeInput>,
): Promise<RecipeResponse> {
  try {
    const updated = await sql.begin(async (tx) => {
      const [row] = await tx`
        UPDATE recipes
        SET
          title = COALESCE(${recipe.title ?? null}, title),
          description = COALESCE(${recipe.description ?? null}, description),
          portions = COALESCE(${recipe.portions ?? null}, portions),
          public = COALESCE(${recipe.public ?? null}, public),
          ingredients = COALESCE(
            ${recipe.ingredients !== undefined ? tx.json(recipe.ingredients) : null},
            recipes.ingredients
          ),
          instructions = COALESCE(
            ${recipe.instructions !== undefined ? tx.json(recipe.instructions) : null},
            recipes.instructions
          )
        WHERE id = ${id}
        RETURNING id, title, description, portions, ingredients, instructions, public
      `;

      if (!row) {
        throw new Error(`Recipe with ID ${id} not found`);
      }

      if (recipe.tags !== undefined) {
        await replaceRecipeTags(tx, id, recipe.tags);
      }

      if (recipe.imgurls && recipe.imgurls.length > 0) {
        await tx`
          INSERT INTO recipe_images ${tx(
            recipe.imgurls.map((image_url) => ({
              recipe_id: id,
              image_url,
              img_storage_type: IMG_STORAGE_TYPE,
            })),
          )}
          ON CONFLICT (recipe_id, image_url) DO NOTHING 
        `;
      }

      const [tagRow] = await tx<{ tags: string[] }[]>`
        SELECT COALESCE(
          ARRAY(
            SELECT tags.value
            FROM recipe_tags
            JOIN tags ON tags.id = recipe_tags.tag_id
            WHERE recipe_tags.recipe_id = ${id}
            ORDER BY tags.value
          ),
          '{}'
        ) AS tags
      `;

      return { ...row, tags: tagRow?.tags ?? [] };
    });

    return RecipeResponseSchema.parse(updated);
  } catch (error) {
    console.error(`DB: Failed to update recipe with ID ${id}:`, error);
    throw new Error(`Database update failed for recipe with ID ${id}`);
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
        COALESCE(
          ARRAY(
            SELECT tags.value
            FROM recipe_tags
            JOIN tags ON tags.id = recipe_tags.tag_id
            WHERE recipe_tags.recipe_id = recipes.id
            ORDER BY tags.value
          ),
          '{}'
        ) AS tags,
        COALESCE(
          ARRAY_AGG(recipe_images.image_url ORDER BY recipe_images.id)
            FILTER (WHERE recipe_images.image_url IS NOT NULL),
          '{}'
        ) AS imgurls
      FROM recipes
      LEFT JOIN recipe_images
        ON recipes.id = recipe_images.recipe_id 
        AND recipe_images.img_storage_type = ${IMG_STORAGE_TYPE}
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

async function deleteRecipeImage(
  user_id: string,
  imgUrls: string[],
): Promise<string[]> {
  if (imgUrls.length === 0) return [];

  try {
    const rows = await sql<{ image_url: string }[]>`
      DELETE FROM recipe_images
      WHERE image_url = ANY(${imgUrls}::text[])
        AND recipe_id IN (
          SELECT id FROM recipes WHERE user_id = ${user_id}
        )
      RETURNING image_url
    `;

    return rows.map((row) => row.image_url);
  } catch (error) {
    console.error("DB: Failed to delete recipe images:", error);
    throw new Error("Failed to delete images from database");
  }
}

async function getRecipesMetaDataWithWhere(
  where: ReturnType<typeof sql>,
  user_id?: number,
): Promise<RecipeMetaDataResponse[]> {
  try {
    const rows = await sql`
      SELECT DISTINCT ON (recipes.id)
        recipes.id,
        recipes.title,
        recipes.description,
        recipes.portions,
        recipes.public,
        COALESCE(
          ARRAY(
            SELECT tags.value
            FROM recipe_tags
            JOIN tags ON tags.id = recipe_tags.tag_id
            WHERE recipe_tags.recipe_id = recipes.id
            ORDER BY tags.value
          ),
          '{}'
        ) AS tags,
        recipe_images.image_url AS imgurl,
        CASE
          WHEN user_recipes_favorite.user_id IS NOT NULL THEN true
          ELSE false
        END AS is_favorite
      FROM recipes
      LEFT JOIN recipe_images
        ON recipes.id = recipe_images.recipe_id
      LEFT JOIN user_recipes_favorite
        ON recipes.id = user_recipes_favorite.recipe_id
        AND user_recipes_favorite.user_id = ${user_id ?? null}
      ${where}
      ORDER BY recipes.id, recipe_images.created_at DESC
    `;

    return z.array(RecipeMetaDataResponseSchema).parse(rows);
  } catch (error) {
    console.error("DB: Failed to fetch recipes with where clause:", error);
    throw new Error("Database fetch failed");
  }
}

async function searchRecipesMetaData(
  query: string,
  where: ReturnType<typeof sql>,
  userId?: number,
) {
  try {
    const searchQuery = query.trim();

    const rows = await sql`
      SELECT DISTINCT ON (recipes.id)
        recipes.id,
        recipes.title,
        recipes.description,
        recipes.portions,
        recipes.public,
        COALESCE(
          ARRAY(
            SELECT tags.value
            FROM recipe_tags
            JOIN tags ON tags.id = recipe_tags.tag_id
            WHERE recipe_tags.recipe_id = recipes.id
            ORDER BY tags.value
          ),
          '{}'
        ) AS tags,
        recipe_images.image_url AS imgurl,
        CASE
          WHEN user_recipes_favorite.user_id IS NOT NULL
          THEN true
          ELSE false
        END AS is_favorite
      FROM recipes

      LEFT JOIN recipe_images
        ON recipes.id = recipe_images.recipe_id

      LEFT JOIN user_recipes_favorite
        ON recipes.id = user_recipes_favorite.recipe_id
        AND user_recipes_favorite.user_id = ${userId ?? null}

      ${where}

      ${
        searchQuery
          ? sql`
              AND (
                recipes.title ILIKE ${`%${searchQuery}%`}
                OR recipes.description ILIKE ${`%${searchQuery}%`}
                OR EXISTS (
                  SELECT 1
                  FROM recipe_tags
                  JOIN tags ON tags.id = recipe_tags.tag_id
                  WHERE recipe_tags.recipe_id = recipes.id
                    AND tags.value ILIKE ${`%${searchQuery}%`}
                )
              )
            `
          : sql``
      }

      ORDER BY
        recipes.id,
        recipe_images.created_at DESC

      LIMIT 20
    `;

    return z.array(RecipeMetaDataResponseSchema).parse(rows);
  } catch (error) {
    console.error("DB: Failed to search recipes:", error);

    throw new Error("Database fetch failed");
  }
}

const RecipesService = {
  getRecipeById,
  deleteRecipeById,
  getRecipesMetaDataWithWhere,
  createRecipeWithImages,
  updateRecipe,
  deleteRecipeImage,
  searchRecipesMetaData,
};

export default RecipesService;
