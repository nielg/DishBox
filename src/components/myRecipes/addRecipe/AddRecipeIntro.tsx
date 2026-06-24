import InputPreview from "@/components/input/InputPreview";
import "@/styles/global.css";
import type { RecipeIntroData } from "@/types/AddRecipe";
import { useEffect, useState } from "react";

type Props = {
  data: RecipeIntroData;
  setData: React.Dispatch<React.SetStateAction<RecipeIntroData>>;
};

export default function AddRecipeIntro({ data, setData }: Props) {
  const [titleValue, setTitleValue] = useState<string>(data.title);
  const [descriptionValue, setDescriptionValue] = useState<string>(
    data.description,
  );

  useEffect(() => {
    setData({
      title: titleValue,
      description: descriptionValue,
    });
  }, [titleValue, descriptionValue, setData]);

  return (
    <>
      <h2 className="text-align-center">Introduction</h2>
      <div className="container">
        <form>
          <InputPreview
            name="title"
            placeHolder="title"
            type="h1"
            value={titleValue}
            setValue={setTitleValue}
          />
          <InputPreview
            name="description"
            placeHolder="description"
            type="textarea"
            rows={5}
            value={descriptionValue}
            setValue={setDescriptionValue}
          />
        </form>
      </div>
    </>
  );
}
