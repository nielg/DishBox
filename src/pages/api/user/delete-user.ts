import authService from "@/service/authService";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ cookies }): Promise<Response> => {
  const auth = await authService.getAuthenticatedUserId(cookies);

  if (!auth.success) {
    return auth.response;
  }
  const user_id = auth.user_id;
  try {
    const result = await authService.deleteUser(user_id);

    if (!result) {
      const errorPayload: ApiResponse<number> = {
        success: false,
        message: "User account could not be found or deleted",
        data: user_id,
      };

      return new Response(JSON.stringify(errorPayload), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Clear session cookies upon successful deletion
    authService.logout(cookies);

    const successPayload: ApiResponse<number> = {
      success: true,
      message: "Successfully deleted user",
      data: user_id,
    };

    return new Response(JSON.stringify(successPayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";

    const errorPayload: ApiResponse<number> = {
      success: false,
      message: errorMessage,
      data: user_id,
    };

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
