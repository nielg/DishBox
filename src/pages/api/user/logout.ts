import { COOKIE_NAME, COOKIE_SECURE } from "astro:env/server";
import type { APIRoute } from "astro";
import type { ApiResponse } from "@/types";

const cookieName = COOKIE_NAME || "_Security_Login_";

export const GET: APIRoute = async ({ cookies }): Promise<Response> => {
  const cook: string = `${cookies.get(cookieName)?.value}`;
  cookies.set(cookieName, cook, {
    path: "/",
    maxAge: 0,
    secure: Boolean(COOKIE_SECURE || false),
  });
  const successPayload: ApiResponse<null> = {
    success: true,
    message: "Logout successfull",
    redirectUrl: "/",
  };

  return new Response(JSON.stringify(successPayload), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
