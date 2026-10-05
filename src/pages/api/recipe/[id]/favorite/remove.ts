import userRepository from "@/repository/userRepository";
import authService from "@/service/authService";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  const recipeId = Number(params.id);

  if (!Number.isInteger(recipeId)) {
    return new Response(JSON.stringify({ error: "Invalid recipe ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    await userRepository.removeUserFavoriteRecipe(auth.user_id, recipeId);

    const successPayload: ApiResponse = {
      success: true,
      message: "Recipe removed from favorites successfully!",
    };

    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to remove recipe favorite";

    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
