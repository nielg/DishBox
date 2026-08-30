export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type RecipeIntroData = { title: string; description: string };

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
