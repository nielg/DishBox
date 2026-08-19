import { z } from "zod";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";
import createRecipe from "@/service/recipeService/createRecipe";
import { handleZodValidationError } from "@/service";

const createRecipeSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
});

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  try {
    const body = await request.json();

    const result = createRecipeSchema.safeParse(body);

    const validationError = handleZodValidationError(result);

    if (validationError) {
      return validationError;
    }

    const createdDataRecipe = await createRecipe(body, cookies);

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
