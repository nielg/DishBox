import { createContext, useContext, useState, type ReactNode } from "react";

export type ListItem = { id: number; value: string };

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

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "preview",
];

interface AddRecipeContextType {
  formData: FormDataType;
  updateField: <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => void;
  addListItem: (list: "ingredients" | "instructions", id: number) => void;
  updateListItem: (
    listName: "ingredients" | "instructions",
    index: number,
    value: string,
  ) => void;
  deleteListItem: (list: "ingredients" | "instructions", id: number) => void;
  progress: RecipeProgress;
  currentIndex: number;
  setProgress: (step: RecipeProgress) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  submit: () => void;
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
    public: false,
  });

  const updateField = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (list: "ingredients" | "instructions", id: number) => {
    setFormData((prev) => ({
      ...prev,
      [list]: [...prev[list], { id, value: "" }],
    }));
  };

  const updateListItem = (
    listName: "ingredients" | "instructions",
    id: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev[listName]];
      updatedList[id] = { ...updatedList[id], value };
      return {
        ...prev,
        [listName]: updatedList,
      };
    });
  };

  const deleteListItem = (list: "ingredients" | "instructions", id: number) => {
    setFormData((prev) => ({
      ...prev,
      [list]: prev[list].filter((_, i) => i !== id),
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

  // On submit
  const submit = async () => {
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
    };

    console.table(recipeRequest);

    try {
      const response = await fetch("/api/recipe/addRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeRequest),
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
