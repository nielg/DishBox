import { z } from "zod";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";
import recipeService from "@/service/recipeService";
import { handleZodValidationError } from "@/service";
import authService from "@/service/authService";

export const createRecipeSchema = z.object({
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
  public: z.boolean(),
  vegan: z.boolean(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema> & {
  user_id: number;
};

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  try {
    const auth = await authService.getAuthenticatedUserId(cookies);
    if (!auth.success) {
      return auth.response;
    }

    const body = await request.json();
    const data = createRecipeSchema.safeParse(body);

    if (!data.success) {
      return handleZodValidationError(data.error);
    }

    const createdDataRecipe = await recipeService.addRecipe({
      ...data.data,
      user_id: auth.user_id,
    });

    const successPayload: ApiResponse = {
      success: true,
      message: "Recipe created successfully!",
      data: createdDataRecipe,
    };

    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create recipe";

    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
