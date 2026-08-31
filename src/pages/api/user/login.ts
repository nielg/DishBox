import { COOKIE_NAME, COOKIE_SECURE, MAX_AGE } from "astro:env/server";
import type { APIRoute } from "astro";
import type { ApiResponse } from "@/types";
import authService from "@/service/authService";
import { handleZodValidationError } from "@/service";
import { loginSchema } from "@/types/user/user.schema";
const cookieName = COOKIE_NAME || "_Security_Login_";

export const POST: APIRoute = async ({
  cookies,
  request,
}): Promise<Response> => {
  const body = await request.json();
  const data = loginSchema.safeParse(body);

  if (!data.success) {
    return handleZodValidationError(data.error);
  }

  try {
    const result = await authService.login(data.data);

    const token = result || "none";
    cookies.set(cookieName, token, {
      path: "/",
      maxAge: MAX_AGE,
      secure: Boolean(COOKIE_SECURE || false),
    });

    const successPayload: ApiResponse<null> = {
      success: true,
      message: "Login successful",
    };

    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
    };

    return Response.json(errorPayload, { status: 500 });
  }
};
