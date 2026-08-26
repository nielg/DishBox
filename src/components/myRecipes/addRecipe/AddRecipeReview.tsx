import { useAddRecipe } from "./AddRecipeContext";
import s from "@/styles/components/addRecipe.module.css";

export default function AddRecipeReview() {
  const { submit, isValid } = useAddRecipe();
  return (
    <div className={s.reviewContainer}>
      <span className={s.stepBadge}>Step 4</span>
      <h2 className={s.stepTitle}>Review &amp; Submit</h2>
      <p className={s.stepDescription}>
        Check the preview on the right. Once you're happy, submit your recipe!
      </p>
      <button onClick={submit} className={s.submitBtn} disabled={!isValid()}>
        Submit Recipe →
      </button>
    </div>
  );
}
