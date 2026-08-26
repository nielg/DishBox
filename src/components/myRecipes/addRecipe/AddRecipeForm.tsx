"use client";
import AddRecipeIntro from "./AddRecipeIntro";
import AddRecipeIngredients from "./AddRecipeIngredients";
import AddRecipeInstructions from "./AddRecipeInstructions";
import AddRecipeReview from "./AddRecipeReview";
import AddRecipeProgressBtn from "./AddRecipeProgressBtn";
import RecipePreview from "./RecipePreview";
import s from "@/styles/components/addRecipe.module.css";
import { AddRecipeProvider, useAddRecipe } from "./AddRecipeContext";

function FormContent() {
  const { progress } = useAddRecipe();

  return (
    <div className="container">
      <div className={s.inputPreviewContainer}>
        <div className="forum">
          {progress === "intro" && <AddRecipeIntro />}
          {progress === "ingredients" && <AddRecipeIngredients />}
          {progress === "instructions" && <AddRecipeInstructions />}
          {progress === "preview" && <AddRecipeReview />}
        </div>
        <RecipePreview />
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

