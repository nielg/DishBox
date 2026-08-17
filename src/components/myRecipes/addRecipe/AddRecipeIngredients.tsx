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

export default function AddRecipePreview({
  items,
  setItems,
  portions,
  setPortions,
}: Props) {
  return (
    <>
      <h2 className="text-align-center">Ingredients</h2>
      <div>
        <label htmlFor="portions">Ingredients for portions: </label>
        <input
          id="portions"
          type="number"
          min="1"
          value={portions || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setPortions(isNaN(val) ? 1 : val);
          }}
        />
      </div>

      <DynamicIngredientsList
        items={items}
        setItems={setItems}
        placeHolder="Apple"
      />
    </>
  );
}
