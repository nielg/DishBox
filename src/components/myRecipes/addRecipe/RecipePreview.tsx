import s from "@/styles/components/addRecipe.module.css";

type Props = {
  title: string;
  description: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
};

export default function RecipePreview({
  title,
  description,
  portions,
  ingredients,
  instructions,
}: Props) {
  return (
    <section>
      {/* Preview label */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "var(--primary-50)",
          color: "var(--primary-700)",
          border: "1px solid var(--primary-200)",
          padding: "0.25rem 0.7rem",
          borderRadius: "2rem",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "1rem",
        }}
      >
        Live Preview
      </div>

      <div className={s.recipePreviewContainer}>
        {/* Title */}
        <h2
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: title ? "var(--text-primary)" : "var(--text-muted)",
            fontStyle: title ? "normal" : "italic",
          }}
        >
          {title || "Your recipe title"}
        </h2>

        {/* Description */}
        <p
          style={{
            margin: "0 0 1rem",
            fontSize: "0.875rem",
            color: description ? "var(--text-secondary)" : "var(--text-muted)",
            fontStyle: description ? "normal" : "italic",
            lineHeight: 1.6,
          }}
        >
          {description || "Your description will appear here…"}
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "var(--border-subtle)",
            margin: "0.75rem 0",
          }}
        />

        {/* Portions badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            backgroundColor: "var(--primary-50)",
            color: "var(--primary-700)",
            border: "1px solid var(--primary-200)",
            padding: "0.25rem 0.65rem",
            borderRadius: "2rem",
            fontSize: "0.78rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          {portions} {portions === 1 ? "portion" : "portions"}
        </div>

        {/* Ingredients */}
        <h3
          style={{
            margin: "0 0 0.6rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--primary-700)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Ingredients
        </h3>
        {ingredients.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              margin: "0 0 1.25rem",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {ingredients.map((item, index) => (
              <li
                key={`ingredient-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: "0.4rem",
                    height: "0.4rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-400)",
                    flexShrink: 0,
                    marginTop: "0.42rem",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginBottom: "1.25rem",
            }}
          >
            No ingredients added yet…
          </p>
        )}

        {/* Instructions */}
        <h3
          style={{
            margin: "0 0 0.6rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--primary-700)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Instructions
        </h3>
        {instructions.length > 0 ? (
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {instructions.map((item, index) => (
              <li
                key={`instruction-${index}`}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: "1.6rem",
                    height: "1.6rem",
                    borderRadius: "50%",
                    background: "var(--gradient-ocean)",
                    color: "white",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ paddingTop: "0.2rem", lineHeight: 1.55 }}>
                  {item}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            No instructions added yet…
          </p>
        )}
      </div>
    </section>
  );
}
