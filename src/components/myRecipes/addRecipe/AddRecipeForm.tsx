"use client";
import { useState } from "react";
import AddRecipeIntro from "./AddRecipeIntro";
import AddRecipeIngredients from "./AddRecipeIngredients";
import AddRecipeInstructions from "./AddRecipeInstructions";
import AddRecipeReview from "./AddRecipeReview";
import AddRecipeProgressBtn from "./AddRecipeProgressBtn";
import type {
  DynamicInputListItem,
  RecipeIntroData,
  RecipeProgress,
} from "@/types/AddRecipe";
import RecipePreview from "./RecipePreview";
import s from "@/styles/components/addRecipe.module.css";

export default function AddRecipeForm() {
  const [progress, setProgress] = useState<RecipeProgress>("intro");
  const [introData, setIntroData] = useState<RecipeIntroData>({
    title: "",
    description: "",
  });

  const [ingredientsData, setIngredientsData] = useState<
    DynamicInputListItem[]
  >([{ id: crypto.randomUUID(), value: "", qty: 1 }]);

  const [instructionsData, setInstructionsData] = useState<
    DynamicInputListItem[]
  >([{ id: crypto.randomUUID(), value: "", qty: 1 }]);

  const combinedIngredientsData = ingredientsData
    .filter((item) => item.value.trim())
    .map((item) => `- ${item.qty} ${item.value}`);

  const combinedInstructionsData = instructionsData
    .filter((item) => item.value.trim())
    .map((item) => item.value);

  const postRecipeRequest = async () => {
    const recipeRequest = {
      title: introData.title,
      description: introData.description,
      portions: 4,
      ingredients: combinedIngredientsData,
      instructions: combinedInstructionsData,
    };

    console.table(recipeRequest);

    try {
      const response = await fetch("/api/recipe/addRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeRequest),
      });

      if (response.ok) {
        console.log("Recipe created successfully!");
        window.location.href = `/myRecipes`;
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error || "Failed to create recipe"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the recipe.");
    }
  };

  return (
    <div className="container">
      <div className={s.inputPreviewContainer}>
        <div className="forum">
          {progress == "intro" && (
            <AddRecipeIntro data={introData} setData={setIntroData} />
          )}
          {progress == "ingredients" && (
            <AddRecipeIngredients
              items={ingredientsData}
              setItems={setIngredientsData}
            />
          )}
          {progress == "instructions" && (
            <AddRecipeInstructions
              items={instructionsData}
              setItems={setInstructionsData}
            />
          )}
          {progress == "preview" && (
            <AddRecipeReview onSubmit={postRecipeRequest} />
          )}
        </div>
        <RecipePreview
          title={introData.title}
          description={introData.description}
          portions={4}
          ingredients={combinedIngredientsData}
          instructions={combinedInstructionsData}
        />
      </div>
      <AddRecipeProgressBtn location={progress} setProgress={setProgress} />
    </div>
  );
}
