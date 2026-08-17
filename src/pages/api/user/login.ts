import {
  COOKIE_NAME,
  COOKIE_SECRET,
  COOKIE_SECURE,
  MAX_AGE,
} from "astro:env/server";
import type { APIRoute } from "astro";
import loginSave from "@/service/userService/login";
import type { ApiResponse } from "@/types";

const cookieName = COOKIE_NAME || "_Security_Login_";
let maxAge = 604800;

export const POST: APIRoute = async ({
  cookies,
  request,
}): Promise<Response> => {
  const formData = await request.formData();

  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const result = await loginSave({
    username,
    password,
    maxAge: Number(MAX_AGE || 604800),
    secret: COOKIE_SECRET || "secret",
  });
  let token = "none";

  if (!result.success) {
    const errorPayload: ApiResponse<null> = {
      success: false,
      message: "Login failed",
    };

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  token = result?.token || "none";
  maxAge = result?.max || 604800;
  cookies.set(cookieName, token, {
    path: "/",
    maxAge: maxAge,
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
};
