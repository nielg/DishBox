import RecipesService from "@/repository/recipesRepository";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const data = await request.json();
    const { id: recipeId } = data;

    if (!recipeId) {
      const errorPayload: ApiResponse = {
        success: false,
        message: "Recipe ID required",
      };
      return Response.json(errorPayload, { status: 400 });
    }

    const deletedRecipe = await RecipesService.deleteRecipeById(recipeId);

    const successPayload: ApiResponse = {
      success: true,
      message: `Succesfully deleted recipe ${deletedRecipe}`,
    };
    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete recipe";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
    };

    return Response.json(errorPayload, { status: 500 });
  }
};
