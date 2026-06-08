"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import "@/styles/components/inputPreview.css";

type Props = {
  name?: string;
  placeHolder?: string;
  info?: string;
  type: "h1" | "textarea";
};

export default function InputPreview({
  name,
  placeHolder = "",
  info,
  type,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  const handleToggle = () => setIsEditing((prev) => !prev);

  const isEmpty = !value.trim();
  const displayValue = value || placeHolder;

  return (
    <div className={`input-preview input-preview--${type}`}>
      <div className="input-preview__container">
        <div className="input-preview__content-wrapper">
          {isEditing ? (
            type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                className="input-preview__field"
                value={value}
                placeholder={placeHolder}
                rows={5}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <input
                id={name}
                name={name}
                type="text"
                className="input-preview__field"
                value={value}
                placeholder={placeHolder}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
              />
            )
          ) : (
            <div className="input-preview__display">
              {type === "h1" ? (
                <h1
                  className={`input-preview__text ${isEmpty ? "is-empty" : ""}`}
                >
                  {displayValue}
                </h1>
              ) : (
                <p
                  className={`input-preview__text ${isEmpty ? "is-empty" : ""}`}
                >
                  {displayValue}
                </p>
              )}
              {/* Ensure value is still submitted when not in edit mode */}
              <input type="hidden" name={name} value={value} />
            </div>
          )}
        </div>

        <div className="input-preview__actions">
          <button
            type="button"
            className="input-preview__btn"
            onClick={handleToggle}
            title={isEditing ? "Save" : "Edit"}
          >
            {isEditing ? (
              <Check className="input-preview__icon" />
            ) : (
              <Pencil className="input-preview__icon" />
            )}
          </button>
        </div>
      </div>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
