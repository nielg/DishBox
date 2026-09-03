export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type DynamicInputInstructionsListItem = {
  id: number;
  value: string;
  step: number;
  duration: string;
};

export type DynamicInputIngredientsListItem = {
  id: number;
  value: string;
};
