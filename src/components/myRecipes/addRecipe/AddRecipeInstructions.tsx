"use client";

import { DynamicInstructionsList } from "@/components/input/DynamicInstructionsList";
import type { DynamicInputInstructionsListItem } from "@/types/recipe";

type Props = {
  items: DynamicInputInstructionsListItem[];
  setItems: React.Dispatch<
    React.SetStateAction<DynamicInputInstructionsListItem[]>
  >;
};

export default function AddRecipePreview({ items, setItems }: Props) {
  return (
    <>
      <h2>Instructions</h2>
      <DynamicInstructionsList
        items={items}
        setItems={setItems}
        placeHolder="Cut the apple"
      />
    </>
  );
}
