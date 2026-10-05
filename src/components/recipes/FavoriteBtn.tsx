import s from "@/styles/components/FavoriteBtn.module.css";
import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  is_favorite: boolean;
  recipe_id: number;
};

export default function FavoriteBtn({ is_favorite, recipe_id }: Props) {
  const [isFavorite, setIsFavorite] = useState(is_favorite);
  const [isLoading, setIsLoading] = useState(false);

  const addFavorite = async () => {
    const response = await fetch(`/api/recipe/${recipe_id}/favorite/add`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }
  };

  const removeFavorite = async () => {
    const response = await fetch(`/api/recipe/${recipe_id}/favorite/remove`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorite) {
        await removeFavorite();
        setIsFavorite(false);
      } else {
        await addFavorite();
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`${s.favoriteButton} ${isFavorite ? s.favorite : ""}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      disabled={isLoading}
      onClick={handleClick}
    >
      <Star
        className={s.favoriteIcon}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}
