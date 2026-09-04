export type ListItem = {
  id: number;
  value: string;
};

export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";

export type FormDataType = {
  title: string;
  description: string;
  portions: number;
  ingredients: { id: number; value: string }[];
  instructions: { id: number; value: string }[];
  public: boolean;
  vegan: boolean;
  imgurls: { id: number; value: string }[];
  id?: number;
};
