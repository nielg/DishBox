import { COOKIE_NAME, COOKIE_SECURE } from "astro:env/server";
import type { APIRoute } from "astro";
import type { ApiResponse } from "@/types";
import { logoutService } from "@/service/userService/logoutService";

const cookieName = COOKIE_NAME || "_Security_Login_";

export const GET: APIRoute = async ({ cookies }): Promise<Response> => {
  const sessionCookie = cookies.get(cookieName);

  if (!sessionCookie || !sessionCookie.value) {
    const errorPayload: ApiResponse<null> = {
      success: false,
      message: "No active session found",
    };
    return new Response(JSON.stringify(errorPayload), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await logoutService(cookies);

  const successPayload: ApiResponse<null> = {
    success: true,
    message: "Logout successful",
    redirectUrl: "/",
  };

  return new Response(JSON.stringify(successPayload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
