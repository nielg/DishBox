import { useAddRecipe } from "./AddRecipeContext";

export default function AddRecipeReview() {
  const { submit } = useAddRecipe();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
    >
      <span
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
        }}
      >
        Step 4
      </span>
      <h2
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "var(--text-primary)",
        }}
      >
        Review &amp; Submit
      </h2>
      <p
        style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}
      >
        Check the preview on the right. Once you're happy, submit your recipe!
      </p>
      <button
        onClick={() => submit()}
        style={{
          marginTop: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 2rem",
          background: "var(--gradient-ocean)",
          color: "var(--text-inverse)",
          border: "none",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "var(--shadow-ocean)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "none";
        }}
      >
        Submit Recipe →
      </button>
    </div>
  );
}
