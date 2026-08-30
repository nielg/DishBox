import { useAddRecipe } from "./context/AddRecipeContext";
import s from "@/styles/components/addRecipe/addRecipe.module.css";

export default function AddRecipeReview() {
  const { submit, isValid, updateField, formData } = useAddRecipe();
  return (
    <div className={s.reviewContainer}>
      <span className={`${s.stepBadge} badge`}>Step 4</span>
      <h2 className={s.stepTitle}>Review &amp; Submit</h2>
      <p className={s.stepDescription}>
        Check the preview on the right. Once you're happy, submit your recipe!
      </p>
      <div>
        <input
          type="checkbox"
          id="public"
          name="public"
          checked={formData.public}
          onChange={(e) => updateField("public", e.target.checked)}
        />
        <label htmlFor="public">Make Public</label>
        <input
          type="checkbox"
          id="vegan"
          name="vegan"
          checked={formData.vegan}
          onChange={(e) => updateField("vegan", e.target.checked)}
        />
        <label htmlFor="vegan">Vegan</label>
      </div>
      <button onClick={submit} className={s.submitBtn} disabled={!isValid()}>
        Submit Recipe →
      </button>
    </div>
  );
}
