"use client";

import { useState } from "react";
import DynamicInputList from "./DynamicInputList";
import DynamicInputItemSlot from "./DynamicInputItemSlot";
import styles from "@/styles/components/inputPreview.module.css";
import type { DynamicInputIngredientsListItem } from "@/types/recipe";
import { useAddRecipe } from "../myRecipes/addRecipe/AddRecipeContext";

export function DynamicIngredientsList() {
  const { formData, updateField } = useAddRecipe();
  const [items, setItems] = useState<DynamicInputIngredientsListItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(
    items[0]?.id || null,
  );

  const addItem = () => {
    const newId = crypto.randomUUID();
    setItems((prev) => [...prev, { id: newId, value: "" }]); // Match your expected fields
    setEditingId(newId);
  };

  const deleteItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  return (
    <DynamicInputList type="ingredients" items={items} onAddItem={addItem}>
      {(item) => {
        const isEditing = editingId === item.id;
        const isEmpty = !item.value.trim();

        return (
          <DynamicInputItemSlot
            key={item.id}
            type="ingredients"
            isEditing={isEditing}
            canDelete={items.length > 1}
            onToggleEdit={() => setEditingId(isEditing ? null : item.id)}
            onDelete={() => deleteItem(item.id)}
            renderInput={
              <input
                type="text"
                className={styles["input-preview__field"]}
                value={item.value}
                placeholder="Ingredients here"
                autoFocus
                onChange={(e) => updateItem(item.id, e.target.value)}
              />
            }
            renderDisplay={
              <p
                className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
              >
                - {item.value}
              </p>
            }
          />
        );
      }}
    </DynamicInputList>
  );
}
