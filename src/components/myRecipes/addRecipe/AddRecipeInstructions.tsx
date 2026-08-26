"use client";

import { DynamicInstructionsList } from "@/components/input/DynamicInstructionsList";
import type { DynamicInputInstructionsListItem } from "@/types/recipe";
import { useState } from "react";

export default function AddRecipeInstructions() {
  const [items, setItems] = useState<DynamicInputInstructionsListItem[]>([]);
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
          Step 3
        </span>
        <h2
          style={{
            margin: "0 0 0.35rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          Instructions
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          Describe each step to prepare the recipe.
        </p>
      </div>
      <DynamicInstructionsList
        items={items}
        setItems={setItems}
        placeHolder="e.g. Cut the apple into slices"
      />
    </>
  );
}
