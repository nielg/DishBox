export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type RecipeIntroData = { title: string; description: string };

export type FormDataType = {
  title: string;
  describe: string;
  portions: number;
  ingredients: { id: number; value: string }[];
  instructions: { id: number; value: string }[];
  public: boolean;
};

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

export type RecipeRequest = {
  user_id: number;
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
