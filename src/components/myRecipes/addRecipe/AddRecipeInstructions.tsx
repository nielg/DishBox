import { DynamicInstructionsList } from "@/components/input/DynamicInstructionsList";
import s from "@/styles/components/addRecipe.module.css";

export default function AddRecipeInstructions() {
  return (
    <>
      <div className={s.stepHeader}>
        <span className={s.stepBadge}>Step 3</span>
        <h2 className={s.stepTitle}>Instructions</h2>
        <p className={s.stepDescription}>
          Describe each step to prepare the recipe.
        </p>
      </div>
      <DynamicInstructionsList />
    </>
  );
}
