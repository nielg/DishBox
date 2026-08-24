import { z } from "zod";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";
import recipeService from "@/service/recipeService";
import { handleZodValidationError } from "@/service";

const createRecipeSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  portions: z
    .number()
    .int("Portions must be an integer")
    .positive("Portions must be a positive number"),
  ingredients: z
    .array(z.string().min(1, "Ingredients cannot be empty"))
    .min(1, "At least one ingredients required"),
  instructions: z
    .array(z.string().min(1, "Instructions cannot be empty"))
    .min(1, "At least one instruction required"),
});

export type createRecipeInput = z.infer<typeof createRecipeSchema>;

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  try {
    const body = await request.json();
    const data = createRecipeSchema.safeParse(body);

    if (!data.success) {
      return handleZodValidationError(data.error);
    }
    const createdDataRecipe = await recipeService.addRecipe(data.data, cookies);

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
