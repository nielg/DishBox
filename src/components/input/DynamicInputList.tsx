"use client";

import { useState } from "react";
import { Pencil, Check, Plus, Trash2 } from "lucide-react";
import styles from "@/styles/components/inputPreview.module.css";
import type { DynamicInputListItem } from "@/types/AddRecipe";

type Item = {
  id: string;
  value: string;
  qty?: number;
};

type Props = {
  name: string;
  type: "ingredients" | "instructions";
  placeHolder?: string;
  items: DynamicInputListItem[];
  setItems: React.Dispatch<React.SetStateAction<DynamicInputListItem[]>>;
};

export default function DynamicInputList({
  name,
  type,
  placeHolder = "Add item...",
  items,
  setItems,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(items[0].id);

  const addItem = () => {
    const newId = crypto.randomUUID();
    setItems((prev) => [...prev, { id: newId, value: "", qty: 1 }]);
    setEditingId(newId);
  };

  const deleteItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: string, value: string, qty?: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value, qty } : item)),
    );
  };

  const toggleEdit = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };
  return (
    <div
      className={`${styles["dynamic-list"]} ${styles[`dynamic-list--${type}`] || ""}`}
    >
      <div className={styles["dynamic-list__items"]}>
        {items.map((item, index) => {
          const isEditing = editingId === item.id;
          const isEmpty = !item.value.trim();
          const displayValue = item.value || placeHolder;

          // Dynamically compute the variant modifier class safely from the module
          const variantClass = styles[`input-preview--${type}`] || "";

          return (
            <div
              key={item.id}
              className={`${styles["input-preview"]} ${variantClass}`}
            >
              <div className={styles["input-preview__container"]}>
                <div className={styles["input-preview__content-wrapper"]}>
                  {isEditing ? (
                    <div className={styles["input-preview__edit-group"]}>
                      {type === "ingredients" && (
                        <input
                          type="number"
                          className={`${styles["input-preview__field"]} ${styles["input-preview__field--qty"]}`}
                          value={item.qty}
                          min="1"
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              item.value,
                              Number(e.target.value),
                            )
                          }
                        />
                      )}
                      {type === "instructions" ? (
                        <textarea
                          className={styles["input-preview__field"]}
                          value={item.value}
                          placeholder={placeHolder}
                          autoFocus
                          onChange={(e) =>
                            updateItem(item.id, e.target.value, item.qty)
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          className={styles["input-preview__field"]}
                          value={item.value}
                          placeholder={placeHolder}
                          autoFocus
                          onChange={(e) =>
                            updateItem(item.id, e.target.value, item.qty)
                          }
                        />
                      )}
                    </div>
                  ) : (
                    <div className={styles["input-preview__display"]}>
                      {type === "ingredients" ? (
                        <p
                          className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
                        >
                          - {item.qty} {displayValue}
                        </p>
                      ) : (
                        <p
                          className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
                        >
                          {index + 1}. {displayValue}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles["input-preview__actions"]}>
                  <button
                    type="button"
                    className={styles["input-preview__btn"]}
                    onClick={() => toggleEdit(item.id)}
                    title={isEditing ? "Save" : "Edit"}
                  >
                    {isEditing ? (
                      <Check className={styles["input-preview__icon"]} />
                    ) : (
                      <Pencil className={styles["input-preview__icon"]} />
                    )}
                  </button>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className={`${styles["input-preview__btn"]} ${styles["input-preview__btn--danger"]}`}
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                    >
                      <Trash2 className={styles["input-preview__icon"]} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className={styles.addBtn} onClick={addItem}>
        <Plus className={styles.icon} />
        Add {type === "ingredients" ? "Ingredient" : "Instruction"}
      </button>
    </div>
  );
}
