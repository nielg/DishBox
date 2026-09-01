import { createClient } from "@supabase/supabase-js";

// Standard client initialized with Public Anon Key
const supabase = createClient(supabase, SUPABASE_ANON_KEY);

async function uploadFile(file) {
  // 1. Fetch the signed upload URL/token from YOUR backend
  const response = await fetch("/api/get-upload-url");
  const { token, path } = await response.json();

  // 2. Upload directly to Supabase using uploadToSignedUrl
  const { data, error } = await supabase.storage
    .from("images")
    .uploadToSignedUrl(path, token, file);

  if (error) {
    console.error("Upload failed:", error.message);
    return;
  }

  // 3. Construct public URL (if the bucket is public)
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(path);

  console.log("Uploaded successfully! Public URL:", publicUrlData.publicUrl);
}
