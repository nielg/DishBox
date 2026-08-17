export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type RecipeIntroData = { title: string; description: string };

export type DynamicInputInstructionsListItem = {
  id: string;
  value: string;
  step: number;
  duration: string;
};

export type DynamicInputIngredientsListItem = {
  id: string;
  value: string;
};

export type RecipeRequest = {
  title: string;
  description: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
};

export type RecipeResponse = {
  id: number;
  title: string;
  description: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
};

export type RecipeMetaDataResponse = {
  id: number;
  title: string;
  description: string;
  portions: number;
};
