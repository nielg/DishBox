import DynamicInputList from "@/components/input/DynamicInputList";
import type { DynamicInputListItem } from "@/types/AddRecipe";

type Props = {
  items: DynamicInputListItem[];
  setItems: React.Dispatch<React.SetStateAction<DynamicInputListItem[]>>;
};
export default function AddRecipePreview({ items, setItems }: Props) {
  return (
    <>
      <h2>Instructions</h2>
      <DynamicInputList
        type="instructions"
        name="instructions"
        placeHolder="Cut the apple"
        items={items}
        setItems={setItems}
      />
    </>
  );
}
