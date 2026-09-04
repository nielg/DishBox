import AddRecipeIntro from "./AddRecipeIntro";
import AddRecipeIngredients from "./AddRecipeIngredients";
import AddRecipeInstructions from "./AddRecipeInstructions";
import AddRecipeReview from "./AddRecipeReview";
import AddRecipeProgressBtn from "./AddRecipeProgress";
import s from "@/styles/components/addRecipe/addRecipe.module.css";
import { AddRecipeProvider, useAddRecipe } from "./context/AddRecipeContext";
import Recipe from "@/components/myRecipes/recipe.tsx";

function FormContent() {
  const { progress, formData } = useAddRecipe();

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
      <div className={s.inputPreviewContainer}>
        <div className="forum">
          {progress === "intro" && <AddRecipeIntro />}
          {progress === "ingredients" && <AddRecipeIngredients />}
          {progress === "instructions" && <AddRecipeInstructions />}
          {progress === "preview" && <AddRecipeReview />}
        </div>
        <Recipe recipe={recipe} />
      </div>
      <AddRecipeProgressBtn />
    </div>
  );
}

export default function AddRecipeForm() {
  return (
    <AddRecipeProvider>
      <FormContent />
    </AddRecipeProvider>
  );
}
