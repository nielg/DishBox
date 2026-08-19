import type { ApiResponse } from "@/types";
import type { AstroCookies } from "astro";
import { COOKIE_NAME, COOKIE_SECRET } from "astro:env/server";
import { logoutService } from "@/service/userService/logoutService";
import wblt from "jsonwebtoken";

export async function logoutUser(): Promise<ApiResponse<null>> {
  try {
    const response = await fetch("/api/user/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Logout request failed with status: ${response.status}`);
    }

    const data: ApiResponse<null> = await response.json();

    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }

    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      success: false,
      message: "An error occurred during logout.",
    };
  }
}

/**
 * Verifys the token and returns user_id if found
 * If not found delete the cookie with the logoutService function and return null
 * @param cookies
 * @returns null | user_id
 */
export async function getAuthenticatedUserId(
  cookies: AstroCookies,
): Promise<number | null> {
  const cookie = cookies.get(COOKIE_NAME);

  if (!cookie?.value) return null;

  try {
    const decoded = wblt.verify(cookie.value, COOKIE_SECRET) as {
      id?: number;
    } | null;
    if (decoded?.id) return decoded.id;
  } catch (error) {
    console.warn("Token verification failed");
  }

  await logoutService(cookies);
  return null;
}
