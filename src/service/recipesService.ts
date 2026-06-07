import fs from "node:fs/promises";
import path from "node:path";
import type { RecipeRequest } from "../types";

const getUserRecipes = async () => {
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

const createRecipe = async (recipe: RecipeRequest) => {
  // Replace spaces with -
  const slug = recipe.title.toLowerCase().trim().replace(/\s+/g, "-");
  const fileName = `${slug}.md`;
  const filePath = path.join(process.cwd(), "src/data/recipes", fileName);

  const fileContent = `---
title: "${recipe.title}"
description: "${recipe.description}"
p_count: ${recipe.p_count}
slug: "${slug}"
---
# ${recipe.title}

${recipe.description}

## Ingredients for ${recipe.p_count}
${recipe.ingredients}

## Instuctions
${recipe.instructions}
`;

  try {
    await fs.writeFile(filePath, fileContent, "utf-8");
    return { success: true, slug };
  } catch (error) {
    console.error("Error writing recipe file:", error);
    throw new Error("Failed to save recipe file");
  }
};

export const RecipesService = { getUserRecipes, createRecipe };
