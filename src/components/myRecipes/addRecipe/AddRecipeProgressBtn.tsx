import type { RecipeProgress } from "@/types/recipe";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "@/styles/components/progressBtn.module.css";
import { useAddRecipe } from "./context/AddRecipeContext";

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "preview",
];

const STEP_LABELS: Record<RecipeProgress, string> = {
  intro: "Intro",
  ingredients: "Ingredients",
  instructions: "Instructions",
  preview: "Review",
};

export default function AddRecipeProgressBtn() {
  const { handleNext, handlePrevious, currentIndex, progress, setProgress } =
    useAddRecipe();

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous step"
      >
        <ArrowLeft size={16} />
      </button>

      <div className={styles.separator} />

      {STEPS.map((step, index) => (
        <>
          <div
            key={step}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <button
              className={`${styles.btn} ${progress === step ? styles.active : ""}`}
              onClick={() => setProgress(step)}
              aria-label={`Go to step ${index + 1}: ${STEP_LABELS[step]}`}
            >
              {index + 1}
            </button>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color:
                  progress === step
                    ? "var(--primary-700)"
                    : "var(--text-muted)",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div key={`sep-${step}`} className={styles.separator} />
          )}
        </>
      ))}

      <div className={styles.separator} />

      <button
        className={styles.btn}
        onClick={handleNext}
        disabled={currentIndex === STEPS.length - 1}
        aria-label="Next step"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
