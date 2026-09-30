export const uploadImgToLocal = async (selectedFiles: File[]) => {
  // Process and upload files in parallel
  const uploadPromises = selectedFiles.map(async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/recipe/recipeImageUpload/local/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload ${file.name} to local storage`);
    }

    const { url } = await res.json();
    return url;
  });

  return uploadPromises;
};
