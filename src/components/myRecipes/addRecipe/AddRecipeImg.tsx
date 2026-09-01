import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const BUCKET_NAME = import.meta.env.PUBLIC_SUPABASE_RECIPE_BUCKET_NAME;

export default function AddRecipeImg() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [objectURLs, setObjectURLs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUrls = fileArray.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...fileArray]);
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
    const publicImageUrls: string[] = [];

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

        console.log("Response from /api/supabase/uploadURL:", res);
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
      publicImageUrls.push(...results);

      setUploadedUrls(publicImageUrls);
      console.log("All uploaded image public URLs:", publicImageUrls);

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
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUpload">Upload images:</label>
      <input
        type="file"
        id="imageUpload"
        onChange={onUpload}
        multiple
        accept="image/png, image/jpeg, image/webp"
      />

      <div className="image-preview">
        {objectURLs.map((url, index) => (
          <div key={url} className="image-container">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              style={{ width: 100 }}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isUploading || selectedFiles.length === 0}
      >
        {isUploading ? "Uploading..." : "Save to Bucket"}
      </button>

      {uploadedUrls.length > 0 && (
        <div className="uploaded-list">
          <p>Uploaded Image URLs:</p>
          <ul>
            {uploadedUrls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
