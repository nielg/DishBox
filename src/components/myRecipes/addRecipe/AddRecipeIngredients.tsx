"use client";

import { DynamicIngredientsList } from "@/components/input/DynamicIngredientsList";
import type { DynamicInputIngredientsListItem } from "@/types/recipe";

type Props = {
  items: DynamicInputIngredientsListItem[];
  setItems: React.Dispatch<
    React.SetStateAction<DynamicInputIngredientsListItem[]>
  >;
  portions: number;
  setPortions: React.Dispatch<React.SetStateAction<number>>;
};

export default function AddRecipeIngredients({
  items,
  setItems,
  portions,
  setPortions,
}: Props) {
  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
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
            marginBottom: "0.65rem",
          }}
        >
          Step 2
        </span>
        <h2
          style={{
            margin: "0 0 0.35rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          Ingredients
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          Add all the ingredients needed for your recipe.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          padding: "0.75rem 1rem",
          backgroundColor: "var(--bg-surface-subtle)",
          border: "1.5px solid var(--border-default)",
          borderRadius: "0.75rem",
        }}
      >
        <label
          htmlFor="portions"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          Portions
        </label>
        <input
          id="portions"
          type="number"
          min="1"
          value={portions || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setPortions(isNaN(val) ? 1 : val);
          }}
          style={{
            width: "5rem",
            padding: "0.35rem 0.6rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-surface)",
            border: "1.5px solid var(--border-default)",
            borderRadius: "0.5rem",
            outline: "none",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        />
      </div>

      <DynamicIngredientsList
        items={items}
        setItems={setItems}
        placeHolder="e.g. 200g flour"
      />
    </>
  );
}
