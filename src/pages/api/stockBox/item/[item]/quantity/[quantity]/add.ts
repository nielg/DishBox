import authService from "@/service/authService";
import BatchService from "@/service/stockBox/BatchServices";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  const itemId = Number(params.item);
  const quantity = Number(params.quantity);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    const errorPayload: ApiResponse = {
      success: false,
      message: "Invalid stock item ID",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    Math.round(quantity * 100) / 100 !== quantity
  ) {
    const errorPayload: ApiResponse = {
      success: false,
      message:
        "Quantity must be a positive number with at most two decimal places",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  try {
    const itemExists = await BatchService.addItemQuantity(
      auth.user_id,
      itemId,
      quantity,
    );
    if (!itemExists) {
      const errorPayload: ApiResponse = {
        success: false,
        message: "Stock item not found or not accessible",
      };
      return Response.json(errorPayload, { status: 404 });
    }

    const successPayload: ApiResponse = {
      success: true,
      message: "Inventory quantity added successfully",
    };
    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to add inventory quantity";
    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
