import { useState, useEffect } from "react";
import s from "@/styles/components/editRecipe/uploadImg.module.css";
import { ImageUp } from "lucide-react";
import { useEditRecipe } from "./context/EditRecipeContext";
import { UtilsUploadRecipeImg } from "@/utils/uploadRecipeImg";

export default function AddRecipeImg() {
  const { formData, addListItem, deleteListItem } = useEditRecipe();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urlsToRemove, setUrlsToRemove] = useState<string[]>([]);
  const [objectURLs, setObjectURLs] = useState<string[]>([
    ...formData.imgurls.map((imgurl) => imgurl.value),
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDeleteImage = (index: number) => {
    const urlToRemove = objectURLs[index];

    if (urlToRemove) {
      setUrlsToRemove((prev) => [...prev, urlToRemove]);
    }

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setObjectURLs((prev) => prev.filter((_, i) => i !== index));
    deleteListItem("imgurls", index);
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

  const addUploadedUrls = async (uploadPromises: string[]) => {
    const results = await Promise.all(uploadPromises);

    results.map((url) => {
      addListItem("imgurls", formData.imgurls.length, url);
    }); // Add each uploaded image URL to the form data
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload img
      const uploadedUrls = await UtilsUploadRecipeImg.uploadImg(selectedFiles);
      if (uploadedUrls.length > 0) {
        addUploadedUrls(uploadedUrls);
      }

      // Remove img
      await UtilsUploadRecipeImg.deleteImg(urlsToRemove);

      // Reset state
      setSelectedFiles([]);
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

      <button type="submit" disabled={isUploading} className={`${s.btn} btn`}>
        {isUploading ? "Uploading..." : "Save images"}
      </button>
    </form>
  );
}
