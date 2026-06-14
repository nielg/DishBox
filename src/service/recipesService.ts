import fs from "node:fs/promises";
import path from "node:path";
import type {
  ApiResponse,
  RecipeDateTypeRequest,
  RecipeDateTypeResponse,
  RecipeRequest,
} from "../types";
import { prisma } from "../../lib/prisma";

const getRecipes = async (): Promise<ApiResponse> => {
  let recipesData: RecipeDateTypeResponse[];
  let recipeFiles: any[];

  try {
    recipesData = await prisma.recipe.findMany();
  } catch (error) {
    return {
      success: false,
      error,
      message: "Failed to fetch recipes data",
      data: null,
    };
  }

  try {
    recipeFiles = await getRecipesFiles();
  } catch (error) {
    return {
      success: false,
      error,
      message: "failed to fetch recipes files",
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    message: "Succesfully fetch recipes",
    data: { recipesData, recipeFiles },
  };
};

const getRecipesBySlug = async (slug: string): Promise<ApiResponse> => {
  try {
    const recipeData: RecipeDateTypeResponse | null =
      await prisma.recipe.findFirst({
        where: {
          slug: slug,
        },
      });
    return { success: true, error: null, data: recipeData, message: "" };
  } catch (error) {
    return {
      success: false,
      error,
      message: `Failed to fetch recipe with slug: ${slug}`,
      data: null,
    };
  }
};

const getRecipesFiles = async () => {
  try {
    const dirPath = path.join(process.cwd(), "src/data/recipes");
    const files = await fs.readdir(dirPath);
    // Filter for markdown files and remove the extension to get the slug
    return files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map((file) => file.replace(/\.(md|mdx)$/, ""));
  } catch (error) {
    console.error("Error reading recipes directory:", error);
    return [];
  }
};

const createRecipe = async (recipe: RecipeRequest): Promise<ApiResponse> => {
  let slug: string;
  let createdDataRecipe: RecipeDateTypeResponse;

  try {
    slug = await createMDFile(
      recipe.title,
      recipe.description,
      recipe.portions,
      recipe.ingredients,
      recipe.instructions,
    );
  } catch (error) {
    return {
      success: false,
      message: "Failed to create md file",
      data: recipe,
      error,
    };
  }

  try {
    const recipeData: RecipeDateTypeRequest = {
      title: recipe.title,
      description: recipe.description,
      portions: recipe.portions,
      slug: slug,
      images: recipe.images || [],
    };

    createdDataRecipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        portions: recipeData.portions,
        slug: recipeData.slug,

        images: {
          create: recipeData.images.map((imagePath) => ({
            path: imagePath,
          })),
        },
      },
    });
  } catch (error) {
    return {
      success: false,
      message: "Failed to post recipeData",
      error,
      data: recipe,
    };
  }

  return { success: true, message: "", error: null, data: createdDataRecipe };
};

const createMDFile = async (
  title: string,
  description: string,
  portions: number,
  ingredients: string,
  instructions: string,
): Promise<string> => {
  const slug = title.toLowerCase().trim().replace(/\s+/g, "-");
  const fileName = `${slug}.md`;
  const filePath = path.join(process.cwd(), "src/data/recipes", fileName);

  const fileContent = `---
title: "${title}"
description: "${description}"
slug:  "${slug}"
---
# ${title}

${description}

## Ingredients for ${portions} portions
${ingredients}

## Instuctions
${instructions}
`;

  try {
    await fs.writeFile(filePath, fileContent, "utf-8");
    return slug;
  } catch (error) {
    console.error("Error writing recipe file:", error);
    throw new Error("Failed to save recipe file");
  }
};

const deleteRecipe = async (id: number) => {
  const deletedRecipe = await prisma.recipe.delete({
    where: {
      id: Number(id),
    },
  });

  const filePath = path.join(
    process.cwd(),
    "src/data/recipes",
    `${deletedRecipe.slug}.md`,
  );
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting recipe file:", error);
  }

  return deletedRecipe;
};

export const RecipesService = {
  getRecipes,
  createRecipe,
  deleteRecipe,
  getRecipesBySlug,
};
