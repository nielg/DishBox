import { useState, useEffect } from "react";
import s from "@/styles/components/editRecipe/uploadImg.module.css";
import { ImageUp } from "lucide-react";
import { useEditRecipe } from "./context/EditRecipeContext";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const BUCKET_NAME = import.meta.env.PUBLIC_SUPABASE_RECIPE_BUCKET_NAME;

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
      // Process and upload files in parallel
      const uploadPromises = selectedFiles.map(async (file) => {
        // 1. Fetch signed URL and token from your Astro API endpoint
        const res = await fetch("/api/supabase/uploadURL", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to get signed URL for ${file.name}`);
        }

        const { path, token } = await res.json();

        // 2. Upload file directly to Supabase Storage using standard PUT fetch request
        // Format: {SUPABASE_URL}/storage/v1/object/upload/sign/{BUCKET_NAME}/{PATH}?token={TOKEN}
        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET_NAME}/${path}?token=${token}`;

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${file.name} to Supabase Storage`);
        }

        // 3. Construct the public URL for rendering/saving to your database
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
        return publicUrl;
      });

      const results = await Promise.all(uploadPromises);
      results.map((url) =>
        addListItem("imgurls", formData.imgurls.length, url),
      ); // Add each uploaded image URL to the form data

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
