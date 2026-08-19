import type { ApiResponse } from "@/types";
import jwt from "jsonwebtoken";
import { COOKIE_SECRET, COOKIE_NAME } from "astro:env/server";
import type { AuthUser } from "@/types/user";
import type { AstroCookies } from "astro";

/**
 * Controleert de uitkomst van een Zod safeParse .
 * Als de validatie faalt, retourneert het direct een 400 Response object.
 * Als de validatie slaagt, retourneert het null.
 */
export function handleZodValidationError(result: any): Response | null {
  if (!result.success) {
    const errorMessage = result.error.issues
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

  return null;
}
/**
 * Verifieert een JWT token en geeft de volledige payload (of geselecteerde velden) terug.
 * Gooit een error als het token ongeldig of verlopen is.
 */
export function verifyAuthToken(cookies: AstroCookies): AuthUser {
  try {
    const token = cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      throw new Error("Unauthorized: Geen token meegegeven");
    }

    const decoded = jwt.verify(token, COOKIE_SECRET) as AuthUser;

    if (!decoded || !decoded.id) {
      throw new Error("Ongeldige token payload");
    }

    return decoded;
  } catch (error) {
    console.error("JWT verificatie mislukt:", error);
    throw new Error("Unauthorized: Ongeldig of verlopen token");
  }
}
