export const uploadImgToLocal = async (
  selectedFiles: File[],
): Promise<string[]> => {
  if (selectedFiles.length === 0) return [];
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
    return url as string;
  });
  return Promise.all(uploadPromises);
};

export const removeImgFromLocal = async (urlsToRemove: string[]) => {
  if (urlsToRemove.length === 0) return;

  console.log(urlsToRemove);

  const res = await fetch("/api/recipe/recipeImageUpload/local/remove", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(urlsToRemove),
  });

  if (!res.ok) {
    throw new Error(`Failed to remove images: ${await res.text()}`);
  }
};
