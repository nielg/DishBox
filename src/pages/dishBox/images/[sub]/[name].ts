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
  const sub = params.sub ?? "";
  const name = params.name ?? "";

  const type = TYPES[path.extname(name).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  const isPublic = sub === "public";

  if (!isPublic) {
    const auth = await authService.getAuthenticatedUserId(cookies);
    if (!auth.success) return auth.response;
    if (String(auth.user_id) !== sub) {
      return new Response("Not found", { status: 404 });
    }
  }

  // Containment check: the resolved path must stay inside UPLOAD_DIR
  const root = path.resolve(UPLOAD_DIR);
  const filePath = path.resolve(root, sub, name);
  if (!filePath.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": `${isPublic ? "public" : "private"}, max-age=31536000, immutable`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
