import type { ApiResponse } from "@/types";

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
