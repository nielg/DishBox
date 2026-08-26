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
  addListItem: (list: "ingredients" | "instructions", value: string) => void;
  updateListItem: (
    listName: "ingredients" | "instructions",
    index: number,
    value: string,
  ) => void;
  progress: RecipeProgress;
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

  const addListItem = (list: "ingredients" | "instructions", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [list]: [...prev[list], { id: Date.now(), value }],
    }));
  };

  const updateListItem = (
    listName: "ingredients" | "instructions",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev[listName]];
      updatedList[index] = { ...updatedList[index], value };
      return {
        ...prev,
        [listName]: updatedList,
      };
    });
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
    console.table(formData);

    try {
      const response = await fetch("/api/recipe/addRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Recipe created successfully!");
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
        progress,
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
