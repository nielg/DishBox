"use client";

import styles from "@/styles/modal.module.css";
import s from "@/styles/components/stockBox/inventoryTable.module.css";
import { type StockInventoryResponse } from "@/types/stock/stock.schema";
import { useState } from "react";
import { Plus, Minus, Send } from "lucide-react";

type Props = {
  action: "add" | "remove" | "request";
  item: StockInventoryResponse;
};

const actionText = {
  add: "Add",
  remove: "Remove",
  request: "Request",
};

export default function EditItemQuantity({ action, item }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setQuantity(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity <= 0) {
      setErrorMsg("Please enter a valid quantity greater than 0.");
      return;
    }

    setErrorMsg(null);

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/stockBox/item/${item.item_id}/quantity/${quantity}/${action}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Failed to change quantity. Please try again.");
      }
      console.error("Failed to change quantity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className={`${s.actionButton} ${s[action]}`}
        type="button"
        aria-label={`${actionText} item`}
        title={`${actionText} item`}
        onClick={() => setIsOpen(true)}
      >
        {action === "add" && <Plus size={16} />}
        {action === "remove" && <Minus size={16} />}
        {action === "request" && <Send size={16} />}
      </button>

      {/* Modal Overlay & Dialog */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>{actionText[action]} item batch</h2>
              <button
                type="button"
                className={styles.closeIconButton}
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>
                {item.name} {item.metric ? `in ${item.metric}` : ""}
              </h2>

              <div className={styles.fieldGroup}>
                <label htmlFor="quantity" className={styles.label}>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 10"
                  className={styles.input}
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
