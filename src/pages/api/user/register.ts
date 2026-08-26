import { z } from "zod";
import authService from "@/service/authService";
import type { APIRoute } from "astro";
import { handleZodValidationError } from "@/service";
import type { ApiResponse } from "@/types";

export const createUserSchema = z.object({
  username: z.string().trim().min(1, "Username cannot be empty"),
  firstname: z.string().trim().min(1, "Firstname cannot be empty"),
  lastname: z.string().trim().min(1, "Lastname cannot be empty"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password needs to be at least 8 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const body = await request.json();
  const data = createUserSchema.safeParse(body);

  if (!data.success) {
    return handleZodValidationError(data.error);
  }

  try {
    await authService.registerUser(data.data);
    const successPayload: ApiResponse<null> = {
      success: true,
      message: "Registration successful",
    };

    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
    };

    return Response.json(errorPayload, { status: 500 });
  }
};
