import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "astro:env/server";
import authService from "@/service/authService";

export const prerender = false;

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);

  if (!auth.success) {
    return auth.response;
  }
  const user_id = auth.user_id;

  const name = path.basename(params.name ?? "");
  const type = TYPES[path.extname(name).toLowerCase()];
  if (!user_id || !type) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(
      path.resolve(UPLOAD_DIR, String(user_id), name),
    );
    return new Response(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
