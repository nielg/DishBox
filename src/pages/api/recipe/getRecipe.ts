import type { APIRoute } from "astro";
import { RecipesService } from "@/service/recipesService";

export const GET: APIRoute = async () => {
  try {
    const recipes = await RecipesService.getRecipes();

    return new Response(JSON.stringify(recipes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to get user recipes", details: error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
