"use client";

import { DynamicIngredientsList } from "@/components/input/DynamicIngredientsList";
import { useAddRecipe } from "./context/AddRecipeContext";
import s from "@/styles/components/addRecipe.module.css";

export default function AddRecipeIngredients() {
  const { formData, updateField } = useAddRecipe();
  return (
    <>
      <div className={s.stepHeader}>
        <span className={s.stepBadge}>Step 2</span>
        <h2 className={s.stepTitle}>Ingredients</h2>
        <p className={s.stepDescription}>
          Add all the ingredients needed for your recipe.
        </p>
      </div>

      <div className={s.portionsInputContainer}>
        <label htmlFor="portions" className={s.portionsLabel}>
          Portions
        </label>
        <input
          id="portions"
          type="number"
          min="1"
          value={formData.portions}
          onChange={(e) => {
            updateField("portions", Number(e.target.value));
          }}
          className={s.portionsInput}
        />
      </div>

      <DynamicIngredientsList />
    </>
  );
}
