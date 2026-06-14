export type ApiResponse = {
  success: boolean;
  error: any;
  message: string;
  data: any;
};

export type RecipeDateTypeRequest = {
  title: string;
  description: string;
  portions: number;
  slug: string;
  images: string[];
};

export type RecipeDateTypeResponse = {
  id: number;
  title: string;
  description: string;
  portions: number;
  slug: string;
  // images: string[];
};

export type RecipeRequest = {
  title: string;
  description: string;
  portions: number;
  ingredients: string;
  instructions: string;
  images?: string[];
};
