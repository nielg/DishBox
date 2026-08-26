import s from "@/styles/components/addRecipe.module.css";
import { useAddRecipe } from "./AddRecipeContext";

export default function RecipePreview() {
  const { formData } = useAddRecipe();

  return (
    <section>
      {/* Preview label */}
      <div className={s.livePreviewBadge}>Live Preview</div>

      <div className={s.recipePreviewContainer}>
        {/* Title */}
        <h2
          className={`${s.previewTitle} ${formData.title ? s.previewTitleFilled : s.previewTitleEmpty}`}
        >
          {formData.title || "Your recipe title"}
        </h2>
        {!formData.title && (
          <p className={s.validationWarning}>Title required</p>
        )}

        {/* Description */}
        <p
          className={`${s.previewDescription} ${formData.description ? s.previewDescriptionFilled : s.previewDescriptionEmpty}`}
        >
          {formData.description || "Your description will appear here…"}
        </p>
        {!formData.description && (
          <p className={s.validationWarning}>Description required</p>
        )}

        {/* Divider */}
        <div className={s.previewDivider} />

        {/* Portions badge */}
        <div className={s.portionsBadge}>
          {formData.portions} {formData.portions === 1 ? "portion" : "portions"}
        </div>

        {/* Ingredients */}
        <h3 className={s.sectionHeading}>Ingredients</h3>
        {formData.ingredients.length > 0 ? (
          <ul className={s.ingredientsList}>
            {formData.ingredients.map((item, index) => (
              <li key={`ingredient-${index}`} className={s.ingredientItem}>
                <span className={s.ingredientBullet} />
                {item.value}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className={s.emptyStateText}>No ingredients added yet…</p>
            <p className={s.validationWarning}>1 ingredient required</p>
          </>
        )}

        {/* Instructions */}
        <h3 className={s.sectionHeading}>Instructions</h3>
        {formData.instructions.length > 0 ? (
          <ol className={s.instructionsList}>
            {formData.instructions.map((item, index) => (
              <li key={`instruction-${index}`} className={s.instructionItem}>
                <span className={s.stepNumberBadge}>{index + 1}</span>
                <span className={s.stepText}>{item.value}</span>
              </li>
            ))}
          </ol>
        ) : (
          <>
            <p className={s.emptyStateText}>No instructions added yet…</p>
            <p className={s.validationWarning}>1 instruction required</p>
          </>
        )}
      </div>
    </section>
  );
}
