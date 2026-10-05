import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import s from "@/styles/components/recipes/recipeGrid.module.css";
import RecipesCard from "./RecipesCard";

type Props = {
  title?: string;
  recipes: RecipeMetaDataResponse[];
};

export default function RecipesGrid({ title, recipes }: Props) {
  return (
    <section className={s.recipesGrid}>
      {title && <h2>{title}</h2>}

      <div className={s.wrapper}>
        <div className={s.container}>
          {recipes.map((recipe) => (
            <div className={s.item} key={recipe.id}>
              <RecipesCard data={recipe} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
