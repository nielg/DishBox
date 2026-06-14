import type { APIRoute } from "astro";
import { RecipesService } from "@/service/recipesService";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response(
      JSON.stringify({ error: "Missing required parameter: slug" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const recipe = await RecipesService.getRecipesBySlug(slug);

    if (!recipe) {
      return new Response(
        JSON.stringify({ error: `Recipe with slug '${slug}' not found` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to get recipe", details: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
