import { COOKIE_NAME, COOKIE_SECURE, MAX_AGE } from "astro:env/server";
import type { APIRoute } from "astro";
import type { ApiResponse } from "@/types";
import authService from "@/service/authService";

const cookieName = COOKIE_NAME || "_Security_Login_";

export const POST: APIRoute = async ({
  cookies,
  request,
}): Promise<Response> => {
  const formData = await request.formData();

  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  try {
    const result = await authService.login({
      username,
      password,
    });

    const token = result || "none";
    cookies.set(cookieName, token, {
      path: "/",
      maxAge: MAX_AGE,
      secure: Boolean(COOKIE_SECURE || false),
    });

    const successPayload: ApiResponse<null> = {
      success: false,
      message: "Login successfull",
      redirectUrl: "/",
    };

    return new Response(JSON.stringify(successPayload), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorPayload: ApiResponse<null> = {
      success: false,
      message: "Login failed",
    };

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
