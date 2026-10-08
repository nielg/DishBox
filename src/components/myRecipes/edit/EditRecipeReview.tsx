import { useEditRecipe } from "./context/EditRecipeContext";
import AddRecipeImg from "./AddRecipeImg";
import s from "@/styles/components/editRecipe/editRecipe.module.css";

type Props = {
  tags: string[];
};

export default function EditRecipeReview({ tags }: Props) {
  const { submit, isValid, updateField, formData } = useEditRecipe();
  const availableTags = Array.from(new Set([...tags, ...formData.tags]));

  const toggleTag = (tag: string) => {
    const nextTags = formData.tags.includes(tag)
      ? formData.tags.filter((selectedTag) => selectedTag !== tag)
      : [...formData.tags, tag];

    updateField("tags", nextTags);
  };

  return (
    <div className={s.reviewContainer}>
      <span className={`${s.stepBadge} badge`}>Step 4</span>
      <h2 className={s.stepTitle}>Review &amp; Submit</h2>
      <p className={s.stepDescription}>
        Check the preview on the right. Once you're happy, submit your recipe!
      </p>
      <section className={s.tagEditor} aria-labelledby="recipe-tags-heading">
        <h3 id="recipe-tags-heading" className={s.tagEditorTitle}>
          Recipe tags
        </h3>
        <p className={s.tagEditorDescription}>
          Select tags to add them. Select them again to remove them.
        </p>
        <div className={s.tagOptions}>
          {availableTags.map((tag) => {
            const selected = formData.tags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                className={`${s.tagOption} ${selected ? s.tagOptionSelected : ""}`}
                aria-pressed={selected}
                onClick={() => toggleTag(tag)}
              >
                {selected ? "✓ " : "+ "}
                {tag}
              </button>
            );
          })}
          {availableTags.length === 0 && (
            <span className={s.noTagsMessage}>No tags are available yet.</span>
          )}
        </div>
      </section>
      <div>
        <input
          type="checkbox"
          id="public"
          name="public"
          checked={formData.public}
          onChange={(e) => updateField("public", e.target.checked)}
        />
        <label htmlFor="public">Make Public</label>
      </div>
      <AddRecipeImg />
      <button onClick={submit} className={s.submitBtn} disabled={!isValid()}>
        Submit Recipe →
      </button>
    </div>
  );
}
