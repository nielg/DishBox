import { z } from "zod";
import { handleZodValidationError } from "@/service";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

const schema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  portions: z.number().positive("Portions must be a positive number"),
});

const service = () => {};
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return handleZodValidationError(validation.error);
  }

  try {
    await service();
    const successPayload: ApiResponse<null> = {
      success: true,
      message: "Success",
    };
    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
    };

    return Response.json(errorPayload, { status: 500 });
  }
};
