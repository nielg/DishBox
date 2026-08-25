import { COOKIE_NAME } from "astro:env/server";
import type { APIRoute } from "astro";
import type { ApiResponse } from "@/types";
import authService from "@/service/authService";

const cookieName = COOKIE_NAME || "_Security_Login_";

export const GET: APIRoute = async ({ cookies }): Promise<Response> => {
  const sessionCookie = cookies.get(cookieName);

  if (!sessionCookie || !sessionCookie.value) {
    const errorPayload: ApiResponse<null> = {
      success: false,
      message: "No active session found",
    };

    return Response.json(errorPayload, { status: 401 });
  }

  await authService.logout(cookies);

  const successPayload: ApiResponse<null> = {
    success: true,
    message: "Logout successful",
    redirectUrl: "/",
  };

  return Response.json(successPayload, { status: 200 });
};
