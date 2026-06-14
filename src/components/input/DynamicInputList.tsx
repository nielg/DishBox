"use client";

import { useState } from "react";
import { Pencil, Check, Plus, Trash2 } from "lucide-react";
import "@/styles/components/inputPreview.css";

type Item = {
  id: string;
  value: string;
  qty?: number;
};

type Props = {
  name: string;
  type: "ingredients" | "instructions";
  placeHolder?: string;
};

export default function DynamicInputList({
  name,
  type,
  placeHolder = "Add item...",
}: Props) {
  const [items, setItems] = useState<Item[]>([
    { id: crypto.randomUUID(), value: "", qty: 1 },
  ]);
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

  // Combine values for hidden input
  const combinedValue = items
    .filter((item) => item.value.trim())
    .map((item) =>
      type === "ingredients" ? `- ${item.qty} ${item.value}` : item.value,
    )
    .join("\n");

  return (
    <div className={`dynamic-list dynamic-list--${type}`}>
      <div className="dynamic-list__items">
        {items.map((item, index) => {
          const isEditing = editingId === item.id;
          const isEmpty = !item.value.trim();
          const displayValue = item.value || placeHolder;

          return (
            <div
              key={item.id}
              className={`input-preview input-preview--${type}`}
            >
              <div className="input-preview__container">
                <div className="input-preview__content-wrapper">
                  {isEditing ? (
                    <div className="input-preview__edit-group">
                      {type === "ingredients" && (
                        <input
                          type="number"
                          className="input-preview__field input-preview__field--qty"
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
                          className="input-preview__field"
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
                          className="input-preview__field"
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
                    <div className="input-preview__display">
                      {type === "ingredients" ? (
                        <p
                          className={`input-preview__text ${isEmpty ? "is-empty" : ""}`}
                        >
                          - {item.qty} {displayValue}
                        </p>
                      ) : (
                        <p
                          className={`input-preview__text ${isEmpty ? "is-empty" : ""}`}
                        >
                          {index + 1}. {displayValue}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="input-preview__actions">
                  <button
                    type="button"
                    className="input-preview__btn"
                    onClick={() => toggleEdit(item.id)}
                    title={isEditing ? "Save" : "Edit"}
                  >
                    {isEditing ? (
                      <Check className="input-preview__icon" />
                    ) : (
                      <Pencil className="input-preview__icon" />
                    )}
                  </button>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="input-preview__btn input-preview__btn--danger"
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                    >
                      <Trash2 className="input-preview__icon" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className="addBtn" onClick={addItem}>
        <Plus className="icon" />
        Add {type === "ingredients" ? "Ingredient" : "Instruction"}
      </button>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={combinedValue} />
    </div>
  );
}
