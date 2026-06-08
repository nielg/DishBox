"use client";
import { useState } from "react";
import { Pencil, Check, Info, Minus } from "lucide-react";
import "@/styles/components/inputPreview.css";

type Props = {
  name?: string;
  placeHolder?: string;
  info?: string;
  number?: number;
  type: "h1" | "textarea" | "ingredients" | "instructions";
};

export default function InputPreview({
  name,
  placeHolder,
  info,
  number,
  type,
}: Props) {
  const [preview, setPreview] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const handleEditClicked = () => {
    setPreview(false);
  };

  const handleSubmitClicked = () => {
    setPreview(true);
  };

  return (
    <div className={`container ${type}`}>
      {preview && (
        <div className="content-container">
          {type == "h1" && (
            <h1 className={`content ${!input ? "empty" : ""}`}>
              {input || placeHolder}
            </h1>
          )}
          {type == "textarea" && (
            <p className={`content ${!input ? "empty" : ""}`}>
              {input || placeHolder}
            </p>
          )}
          {type == "ingredients" && (
            <div className="ingredientPreview">
              <Minus className="icon" />
              <p className={`content ${!input ? "empty" : ""}`}>
                {input || placeHolder}
              </p>
              <p className={`content ${!input ? "empty" : ""}`}>{quantity}</p>
            </div>
          )}
          {type == "instructions" && (
            <p className={`content ${!input ? "empty" : ""}`}>
              {number + "."} {input || placeHolder}
            </p>
          )}
        </div>
      )}
      {!preview && (
        <div className="input-container">
          {type == "textarea" && (
            <textarea
              id={name}
              name={name}
              value={input}
              autoFocus={!preview}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          {type == "h1" && (
            <input
              id={name}
              type={preview ? "hidden" : "text"}
              name={name}
              placeholder={placeHolder}
              value={input}
              autoFocus={!preview}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          {type == "ingredients" && (
            <div className="ingredientsInput">
              <Minus className="list-icon" />
              <input
                id={name}
                type="text"
                name={name}
                placeholder={placeHolder}
                value={input}
                autoFocus={!preview}
                onChange={(e) => setInput(e.target.value)}
              />
              <input
                type="number"
                value={quantity}
                min={0}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          )}
          {type == "instructions" && (
            <textarea
              id={name}
              name={name}
              value={input}
              autoFocus={!preview}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
        </div>
      )}

      <div className="icons">
        {preview ? (
          <Pencil className="icon" onClick={() => handleEditClicked()} />
        ) : (
          <Check className="icon" onClick={() => handleSubmitClicked()} />
        )}
        <Info className="icon" />
      </div>
    </div>
  );
}
