import DynamicInputList from "@/components/input/DynamicInputList";
import type { DynamicInputListItem } from "@/types/AddRecipe";

type Props = {
  items: DynamicInputListItem[];
  setItems: React.Dispatch<React.SetStateAction<DynamicInputListItem[]>>;
};
export default function AddRecipePreview({ items, setItems }: Props) {
  return (
    <>
      <h2 className="text-align-center">Ingredients</h2>
      <div>
        <label htmlFor="portions">Ingredients for portions: </label>
        <input type="number" />
      </div>
      <DynamicInputList
        name="ingredients"
        type="ingredients"
        placeHolder="Apple"
        items={items}
        setItems={setItems}
      ></DynamicInputList>
    </>
  );
}
