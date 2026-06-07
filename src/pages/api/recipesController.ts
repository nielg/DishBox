import type { APIRoute } from "astro";
import { RecipesService } from "../../service/recipesService";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const result = await RecipesService.createRecipe(body);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create recipe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
