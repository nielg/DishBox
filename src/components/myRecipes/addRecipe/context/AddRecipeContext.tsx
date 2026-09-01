import { createContext, useContext, useState, type ReactNode } from "react";
import {
  type FormDataType,
  type RecipeProgress,
} from "./addRecipeContex.types";
import {
  CreateRecipeSchema,
  type CreateRecipeBody,
} from "@/types/recipe/recipe.schemas";

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "preview",
];

type listItem = "ingredients" | "instructions" | "imgURLs";

interface AddRecipeContextType {
  formData: FormDataType;
  updateField: <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => void;
  addListItem: (list: listItem, id: number, value?: string) => void;
  updateListItem: (listName: listItem, index: number, value: string) => void;
  deleteListItem: (list: listItem, id: number) => void;
  progress: RecipeProgress;
  currentIndex: number;
  setProgress: (step: RecipeProgress) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  submit: () => void;
  isValid: () => CreateRecipeBody | null;
}

const AddRecipeContext = createContext<AddRecipeContextType | undefined>(
  undefined,
);

export function AddRecipeProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<RecipeProgress>("intro");
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    portions: 4,
    ingredients: [],
    instructions: [],
    vegan: true,
    public: false,
    imgURLs: [],
  });

  const updateField = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (list: listItem, id: number, value?: string) => {
    setFormData((prev) => ({
      ...prev,
      [list]: [...prev[list], { id, value: value ?? "" }],
    }));
  };

  const updateListItem = (listName: listItem, id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item) =>
        item.id === id ? { ...item, value } : item,
      ),
    }));
  };

  const deleteListItem = (listName: listItem, id: number) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((item) => item.id !== id),
    }));
  };
  // Progress
  const currentIndex = STEPS.indexOf(progress);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setProgress(STEPS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setProgress(STEPS[currentIndex + 1]);
    }
  };

  // Validation
  const isValid = (): CreateRecipeBody | null => {
    const recipeRequest = {
      title: formData.title,
      description: formData.description,
      portions: formData.portions,
      ingredients: formData.ingredients
        .filter((item) => item.value.trim())
        .map((item) => item.value),
      instructions: formData.instructions
        .filter((item) => item.value.trim())
        .map((item) => item.value),
      public: formData.public,
      vegan: formData.vegan,
      imgURLs: formData.imgURLs.map((item) => item.value),
    };
    const result = CreateRecipeSchema.safeParse(recipeRequest);

    return result.success ? result.data : null;
  };

  // On submit
  const submit = async () => {
    const body = isValid();
    if (!body) {
      return;
    }

    try {
      const response = await fetch("/api/recipe/addRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.location.href = `/myRecipes`;
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error || "Failed to create recipe"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the recipe.");
    }
  };

  return (
    <AddRecipeContext.Provider
      value={{
        formData,
        updateField,
        addListItem,
        updateListItem,
        deleteListItem,
        progress,
        currentIndex,
        setProgress,
        handleNext,
        handlePrevious,
        submit,
        isValid,
      }}
    >
      {children}
    </AddRecipeContext.Provider>
  );
}

export const useAddRecipe = () => {
  const context = useContext(AddRecipeContext);
  if (!context) {
    throw new Error("useAddRecipe must be used within an AddRecipeProvider");
  }
  return context;
};
