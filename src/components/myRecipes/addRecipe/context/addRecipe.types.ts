export type ListItem = {
  id: number;
  value: string;
};

export type FormDataType = {
  title: string;
  description: string;
  portions: number;
  ingredients: ListItem[];
  instructions: ListItem[];
  public: boolean;
};

export type RecipeProgress =
  | "intro"
  | "ingredients"
  | "instructions"
  | "preview";
