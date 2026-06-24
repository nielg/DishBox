import type { RecipeProgress } from "@/types/AddRecipe";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "@/styles/components/progressBtn.module.css";

interface Props {
  location: RecipeProgress;
  setProgress: React.Dispatch<React.SetStateAction<RecipeProgress>>;
}

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "preview",
];

export default function AddRecipeProgressBtn({ location, setProgress }: Props) {
  const currentIndex = STEPS.indexOf(location);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setProgress(STEPS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setProgress(STEPS[currentIndex + 1]);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ArrowLeft size={18} />
      </button>

      <button
        className={`${styles.btn} ${location === "intro" ? styles.active : ""}`}
        onClick={() => setProgress("intro")}
      >
        1
      </button>
      <button
        className={`${styles.btn} ${location === "ingredients" ? styles.active : ""}`}
        onClick={() => setProgress("ingredients")}
      >
        2
      </button>
      <button
        className={`${styles.btn} ${location === "instructions" ? styles.active : ""}`}
        onClick={() => setProgress("instructions")}
      >
        3
      </button>
      <button
        className={`${styles.btn} ${location === "preview" ? styles.active : ""}`}
        onClick={() => setProgress("preview")}
      >
        4
      </button>

      <button
        className={styles.btn}
        onClick={handleNext}
        disabled={currentIndex === STEPS.length - 1}
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
