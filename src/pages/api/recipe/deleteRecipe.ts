import RecipesService from "@/repository/recipesRepository";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const data = await request.json();
    const { id: recipeId } = data;

    if (!recipeId) {
      return new Response(JSON.stringify({ error: "Recipe ID is required" }), {
        status: 400,
      });
    }

    const deletedRecipe = await RecipesService.deleteRecipeById(recipeId);

    return new Response(JSON.stringify({ success: true, deletedRecipe }), {
      status: 200,
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete row", details: error }),
      { status: 500 },
    );
  }
};
