import s from "@/styles/components/addRecipe.module.css";

type Props = {
  title: string;
  description: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
};

export default function RecipeView({
  title,
  description,
  portions,
  ingredients,
  instructions,
}: Props) {
  return (
    <section>
      <h1 className="text-align-center">Preview</h1>
      <div className={s.recipePreviewContainer}>
        <h2 className="text-align-center">{title}</h2>
        <p>{description}</p>
        <h2 className="text-align-center">Ingredients</h2>
        <p>Portions: {portions}</p>
        <ul>
          {ingredients.map((item, index) => (
            <li key={`ingredient-${index}`}>{item}</li>
          ))}
        </ul>
        <h2 className="text-align-center">Instructions</h2>
        <ol>
          {instructions.map((item, index) => (
            <li key={`instruction-${index}`}>{item}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
