import { z } from "zod";
import authService from "@/service/authService";
import type { APIRoute } from "astro";
import { handleZodValidationError } from "@/service";

const createUserSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  firstname: z.string().min(1, "Firstname cannot be empty"),
  lastname: z.string().min(1, "Lastname cannot be empty"),
  email: z.email().min(1, "email cannot be empty"),
  password: z.string().min(8, "Password needs to be atleast 8 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const body = await request.json();
  const data = createUserSchema.safeParse(body);

  if (!data.success) {
    return handleZodValidationError(data.error);
  }

  const result = await authService.registerUser(data.data);

  if (!result.success) {
    return new Response(JSON.stringify({ message: result.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.redirect(new URL("user/login", request.url), 303);
};
