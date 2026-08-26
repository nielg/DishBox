import InputPreview from "@/components/input/InputPreview";
import "@/styles/global.css";
import { useAddRecipe } from "./AddRecipeContext";

export default function AddRecipeIntro() {
  const { formData, updateField } = useAddRecipe();

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            backgroundColor: "var(--primary-50)",
            color: "var(--primary-700)",
            border: "1px solid var(--primary-200)",
            padding: "0.25rem 0.7rem",
            borderRadius: "2rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.65rem",
          }}
        >
          Step 1
        </span>
        <h2
          style={{
            margin: "0 0 0.35rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          Introduction
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          Give your recipe a title and a short description.
        </p>
      </div>
      <form>
        <InputPreview
          name="title"
          placeHolder="Recipe title"
          type="h1"
          value={formData.title}
          setValue={(val) => updateField("title", val)}
        />
        <InputPreview
          name="description"
          placeHolder="Describe your recipe…"
          type="textarea"
          rows={5}
          value={formData.description}
          setValue={(val) => updateField("description", val)}
        />
      </form>
    </>
  );
}

