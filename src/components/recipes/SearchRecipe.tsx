"use client";

import { useEffect, useState } from "react";
import s from "@/styles/components/recipes/searchRecipe.module.css";
import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import RecipesGrid from "./RecipesGrid";
import { X } from "lucide-react";

type Props = {
  initialRecipes: RecipeMetaDataResponse[];
};

export default function SearchRecipe({ initialRecipes }: Props) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] =
    useState<RecipeMetaDataResponse[]>(initialRecipes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't search when the input is empty
    if (!query.trim()) {
      setRecipes(initialRecipes);
      return;
    }

    // Wait 300ms after the user stops typing
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/recipe/search?query=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data.data);
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cancel the previous timeout if the user types again
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <section className={s.searchRecipe}>
      <div className={s.searchInputContainer}>
        <div className={s.searchInputWrapper}>
          <input
            name="query"
            className={s.searchInput}
            type="text"
            placeholder="Search recipes by title or tag"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              className={s.clearIcon}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className={s.statusContainer}>
          {loading && <p className={s.status}>Searching...</p>}

          {!loading && query && recipes.length === 0 && (
            <p className={s.status}>No recipes found.</p>
          )}
        </div>
      </div>

      <RecipesGrid recipes={recipes} />
    </section>
  );
}
