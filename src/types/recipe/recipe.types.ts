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

export type RecipeResponse = {
  id: number;
  title: string;
  description: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
  public: boolean;
  vegan: boolean;
};

export type RecipeMetaDataResponse = {
  id: number;
  title: string;
  description: string;
  portions: number;
  public: boolean;
  vegan: boolean;
};
