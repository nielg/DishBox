import sql from "@/lib/db";
import {
  RecipeMetaDataResponseSchema,
  type RecipeMetaDataResponse,
  RecipeResponseSchema,
  type RecipeResponse,
} from "@/types/recipe/recipe.schemas";
import { z } from "astro/zod";
import { IMG_STORAGE_TYPE } from "astro:env/client";
import type postgres from "postgres";

interface getRecipeMetadataArgs {
  userId?: number;
  query?: string;
  publicRecipes?: boolean;
  recipes_ids?: number[];
}

async function getRecipeMetadata({
  userId,
  query,
  publicRecipes,
  recipes_ids,
}: getRecipeMetadataArgs): Promise<RecipeMetaDataResponse[]> {
  const searchFilter = query
    ? sql`
          AND (
            recipes.title ILIKE ${`%${query}%`}
            OR recipes.description ILIKE ${`%${query}%`}
            OR EXISTS (
              SELECT 1
              FROM recipe_tags
              JOIN tags ON tags.id = recipe_tags.tag_id
              WHERE recipe_tags.recipe_id = recipes.id
                AND tags.value ILIKE ${`%${query}%`}
            )
          )
        `
    : sql``;
  const resultLimit = query !== undefined ? sql`LIMIT 20` : sql``;

  const whereConditions = [];

  if (publicRecipes || !userId) {
    whereConditions.push(sql`recipes.public = true`);
  } else {
    whereConditions.push(sql`recipes.user_id = ${userId}`);
  }

  if (recipes_ids && recipes_ids.length > 0) {
    whereConditions.push(
      sql`recipes.id = ANY(${sql.array(recipes_ids)}::integer[])`,
    );
  }

  // Combine conditions with AND
  const whereClause =
    whereConditions.length > 0
      ? sql`WHERE ${whereConditions.reduce((acc, cond) => sql`${acc} AND ${cond}`)}`
      : sql``;

  let rows: unknown;

  try {
    rows = await sql`
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
          user_recipes_favorite.user_id IS NOT NULL AS is_favorite
        FROM recipes
        LEFT JOIN recipe_images
          ON recipes.id = recipe_images.recipe_id
        LEFT JOIN user_recipes_favorite
          ON recipes.id = user_recipes_favorite.recipe_id
          AND user_recipes_favorite.user_id = ${userId ?? null}
        ${whereClause}
        ${searchFilter}
        ORDER BY recipes.id, recipe_images.created_at DESC
        ${resultLimit}
      `;
  } catch (error) {
    console.error("DB: Failed to fetch recipe metadata:", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(RecipeMetaDataResponseSchema).parse(rows);
}

async function getRecipeById(id: number): Promise<RecipeResponse> {
  let rows: postgres.Row[];
  try {
    rows = await sql`
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
      `;
  } catch (error) {
    console.error("DB: Failed to fetch recipe:", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  const [row] = rows;
  if (!row) {
    throw new Error(`No recipe found with id: ${id}`);
  }

  return RecipeResponseSchema.parse(row);
}

export { getRecipeById, getRecipeMetadata };
