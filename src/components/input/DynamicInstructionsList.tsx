"use client";

import { useState } from "react";
import DynamicInputList from "./DynamicInputList";
import DynamicInputItemSlot from "./DynamicInputItemSlot";
import styles from "@/styles/components/inputPreview.module.css";
import type { DynamicInputInstructionsListItem } from "@/types/recipe";
import { useAddRecipe } from "../myRecipes/addRecipe/AddRecipeContext";

export function DynamicInstructionsList() {
  const { formData } = useAddRecipe();
  const [items, setItems] = useState<DynamicInputInstructionsListItem[]>([]);

  const [editingId, setEditingId] = useState<number | null>(
    items[0]?.id || null,
  );

  const addItem = () => {
    const newId = formData.instructions.length;
    setItems((prev) => [
      ...prev,
      { id: newId, value: "", step: 1, duration: "10min" },
    ]);
    setEditingId(newId);
  };

  const deleteItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  return (
    <DynamicInputList type="instructions" items={items} onAddItem={addItem}>
      {(item, index) => {
        const isEditing = editingId === item.id;
        const isEmpty = !item.value.trim();

        return (
          <DynamicInputItemSlot
            key={item.id}
            type="instructions"
            isEditing={isEditing}
            canDelete={items.length > 1}
            onToggleEdit={() => setEditingId(isEditing ? null : item.id)}
            onDelete={() => deleteItem(item.id)}
            renderInput={
              <textarea
                className={styles["input-preview__field"]}
                value={item.value}
                placeholder="Placeholder"
                autoFocus
                onChange={(e) => updateItem(item.id, e.target.value)}
              />
            }
            renderDisplay={
              <p
                className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
              >
                {index + 1}. {item.value || "Placeholder"}
              </p>
            }
          />
        );
      }}
    </DynamicInputList>
  );
}
