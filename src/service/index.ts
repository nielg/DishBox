import type { ApiResponse } from "@/types";
import type { ZodError } from "astro:schema";

/**
 * Confert the zod.error object to a ApiResponse
 */
export function handleZodValidationError(error: ZodError): Response {
  const errorMessage = error.issues
    .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  const errorPayload: ApiResponse = {
    success: false,
    message: "Validation failed",
    error: errorMessage,
  };

  return new Response(JSON.stringify(errorPayload), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
