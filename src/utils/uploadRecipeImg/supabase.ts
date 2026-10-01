const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const BUCKET_NAME = import.meta.env.PUBLIC_SUPABASE_RECIPE_BUCKET_NAME;

export const uploadImgToSubaBase = async (
  selectedFiles: File[],
): Promise<string[]> => {
  if (!SUPABASE_URL || !BUCKET_NAME) {
    throw new Error(
      "Missing or wrong configuration for supabase bucket storage",
    );
  }

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

  return Promise.all(uploadPromises);
};
