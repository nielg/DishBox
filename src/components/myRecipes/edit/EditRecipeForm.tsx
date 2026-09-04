import EditRecipeProgressBtn from "./EditRecipeProgress";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import Recipe from "../Recipe";
import type { RecipeResponse } from "@/types/recipe/recipe.schemas";
import { useEffect } from "react";
import { useEditRecipe, EditRecipeProvider } from "./context/EditRecipeContext";
import EditRecipeIngredients from "./EditRecipeIngredients";
import EditRecipeInstructions from "./EditRecipeInstructions";
import EditRecipeIntro from "./EditRecipeIntro";
import EditRecipeReview from "./EditRecipeReview";

type Props = {
  inputRecipe?: RecipeResponse;
};

function FormContent({ inputRecipe }: Props) {
  const { progress, formData, loadFormData } = useEditRecipe();

  useEffect(() => {
    if (inputRecipe) {
      loadFormData(inputRecipe);
    }
  }, [inputRecipe]);

  const recipe = {
    title: formData.title,
    description: formData.description,
    portions: formData.portions,
    ingredients: formData.ingredients.map((item) => item.value),
    instructions: formData.instructions.map((item) => item.value),
    public: formData.public,
    vegan: formData.vegan,
    imgurls: formData.imgurls.map((item) => item.value),
  };

  return (
    <div className="container">
      <div
        className={`${s.inputPreviewContainer} ${progress === "preview" ? s.previewMode : ""}`}
      >
        <div className="forum">
          {progress === "intro" && <EditRecipeIntro />}
          {progress === "ingredients" && <EditRecipeIngredients />}
          {progress === "instructions" && <EditRecipeInstructions />}
          {progress === "preview" && <EditRecipeReview />}
        </div>
        <Recipe recipe={recipe} />
      </div>
      <EditRecipeProgressBtn />
    </div>
  );
}

export default function EditRecipeForm({ inputRecipe }: Props) {
  return (
    <EditRecipeProvider>
      <FormContent inputRecipe={inputRecipe} />
    </EditRecipeProvider>
  );
}
