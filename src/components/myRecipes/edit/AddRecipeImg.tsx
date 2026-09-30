import { useState, useEffect } from "react";
import s from "@/styles/components/editRecipe/uploadImg.module.css";
import { ImageUp } from "lucide-react";
import { useEditRecipe } from "./context/EditRecipeContext";
import { uploadImgToSubaBase } from "@/utils/uploadRecipeImg/supabase";
import { uploadImgToLocal } from "@/utils/uploadRecipeImg/local";
import { IMG_STORAGE_TYPE } from "astro:env/client";

export default function AddRecipeImg() {
  const { formData, addListItem } = useEditRecipe();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [objectURLs, setObjectURLs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDeleteImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setObjectURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const filesArray = Array.from(event.dataTransfer.files);
    uploadFiles(filesArray);
  };

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    uploadFiles(fileArray);
  };

  const uploadFiles = (filesArray: File[]) => {
    const newUrls = filesArray.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...filesArray]);
    setObjectURLs((prev) => [...prev, ...newUrls]);
  };

  useEffect(() => {
    return () => {
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectURLs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      let uploadPromises;
      if (IMG_STORAGE_TYPE === "supabase") {
        uploadPromises = await uploadImgToSubaBase(selectedFiles);
      } else if (IMG_STORAGE_TYPE === "local") {
        uploadPromises = await uploadImgToLocal(selectedFiles);
      } else {
        throw new Error("Missing env variable IMG_STORAGE_TYPE");
      }

      const results = await Promise.all(uploadPromises);

      results.map((url) => {
        addListItem("imgurls", formData.imgurls.length, url);
      }); // Add each uploaded image URL to the form data

      // Reset local previews after successful upload
      setSelectedFiles([]);
      setObjectURLs([]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={s.uploadForm}>
      <div
        className={s.uploadContainer}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <label htmlFor="imageUpload">
          <h3>Upload images:</h3>
          <p>click to select or drag and drop files here (PNG, JPEG, WEBP)</p>
          <ImageUp size={24} />
          <input
            type="file"
            id="imageUpload"
            onChange={onUpload}
            multiple
            accept="image/png, image/jpeg, image/webp"
            hidden
          />
        </label>
        <div className={s.imagePreviewContainer}>
          {objectURLs.map((url, index) => (
            <div key={url} className={s.imageWrapper}>
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className={s.previewImage}
                onClick={() => onDeleteImage(index)}
                title="Click to remove"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading || selectedFiles.length === 0}
        className={`${s.btn} btn`}
      >
        {isUploading ? "Uploading..." : "Save images"}
      </button>
    </form>
  );
}
