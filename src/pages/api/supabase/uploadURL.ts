import {
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  PUBLIC_SUPABASE_RECIPE_BUCKET_NAME,
} from "astro:env/server";
import type { APIRoute } from "astro";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import authService from "@/service/authService";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucketName = PUBLIC_SUPABASE_RECIPE_BUCKET_NAME;

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseBucketName) {
  throw new Error("Missing required Supabase environment variables.");
}

// Initialize admin client
const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
);

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  const body = await request.json();

  const fileExtension = body.fileType.split("/")[1];
  const fileName = `${auth.user_id}/${Date.now()}.${fileExtension}`;

  // Request temporary signed upload URL
  const { data, error } = await supabaseAdmin.storage
    .from(supabaseBucketName)
    .createSignedUploadUrl(fileName);

  if (error || !data) {
    return new Response(
      JSON.stringify({
        error: error?.message ?? "Failed to create signed URL",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Return payload to client via Web standard Response
  return new Response(
    JSON.stringify({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
