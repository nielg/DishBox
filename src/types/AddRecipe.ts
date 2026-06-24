export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type RecipeIntroData = { title: string; description: string };

export type DynamicInputListItem = {
  id: string;
  value: string;
  qty?: number;
};
