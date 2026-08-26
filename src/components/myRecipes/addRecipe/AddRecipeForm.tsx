"use client";
import { useState } from "react";
import AddRecipeIntro from "./AddRecipeIntro";
import AddRecipeIngredients from "./AddRecipeIngredients";
import AddRecipeInstructions from "./AddRecipeInstructions";
import AddRecipeReview from "./AddRecipeReview";
import AddRecipeProgressBtn from "./AddRecipeProgressBtn";
import type {
  DynamicInputIngredientsListItem,
  DynamicInputInstructionsListItem,
} from "@/types/recipe";
import RecipePreview from "./RecipePreview";
import s from "@/styles/components/addRecipe.module.css";
import { AddRecipeProvider, useAddRecipe } from "./AddRecipeContext";

function FormContent() {
  const { formData, updateField, progress } = useAddRecipe();

  return (
    <div className="container">
      <div className={s.inputPreviewContainer}>
        <div className="forum">
          {progress == "intro" && (
            <AddRecipeIntro formData={formData} updateField={updateField} />
          )}
          {progress == "ingredients" && <AddRecipeIngredients />}
          {progress == "instructions" && <AddRecipeInstructions />}
          {progress == "preview" && (
            <AddRecipeReview onSubmit={postRecipeRequest} />
          )}
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
