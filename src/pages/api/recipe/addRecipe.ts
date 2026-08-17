import RecipesService from "@/repository/recipesRepository";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      const errorPayload: ApiResponse = {
        success: false,
        error: "Title and description are required",
        message: "Validation failed",
      };

      return new Response(JSON.stringify(errorPayload), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const createdDataRecipe = await RecipesService.createRecipe(body);

    const successPayload: ApiResponse = {
      success: true,
      error: null,
      message: "Recipe created successfully!",
      data: createdDataRecipe,
    };

    return new Response(JSON.stringify(successPayload), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);

    const serverErrorPayload: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      message: "Failed to create recipe",
    };

    return new Response(JSON.stringify(serverErrorPayload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
