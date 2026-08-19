import authService from "@/service/authService";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const formData = await request.formData();

  const username = formData.get("username")?.toString() ?? "";
  const firstName = formData.get("firstName")?.toString() ?? "";
  const lastName = formData.get("lastName")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const result = await authService.registerUser({
    username,
    firstName,
    lastName,
    email,
    password,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ message: result.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.redirect(new URL("user/login", request.url), 303);
};
