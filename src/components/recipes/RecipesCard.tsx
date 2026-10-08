import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import FavoriteBtn from "@/components/recipes/FavoriteBtn";
import s from "@/styles/components/recipes/recipeCard.module.css";

type Props = {
  data: RecipeMetaDataResponse;
  userId?: string;
};

export default function RecipesCard({ data, userId }: Props) {
  const defaultImg = "/myRecipes/images/public/default-img.png";

  return (
    <a href={`/myRecipes/${data.id}`} className={s.cardLink}>
      <article className={s.card}>
        <div className={s.cardThumbnail}>
          <img
            className={s.cardImg}
            src={data.imgurl ?? defaultImg}
            width={280}
            height={160}
            alt={`${data.title} thumbnail`}
          />

          {userId && (
            <FavoriteBtn recipe_id={data.id} is_favorite={data.is_favorite} />
          )}

          <div className={s.cardImgOverlay} />
        </div>

        <div className={s.cardBody}>
          <h3 className={s.cardTitle}>{data.title}</h3>

          {data.description && <p className={s.cardDesc}>{data.description}</p>}

          <div className={s.cardFooter}>
            <span className={s.viewLink}>
              View recipe
              <span className={s.arrowIcon}>→</span>
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
