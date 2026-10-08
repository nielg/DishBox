import { IMG_STORAGE_TYPE } from "astro:env/client";
import { uploadImgToSubaBase } from "./supabase";
import { removeImgFromLocal, uploadImgToLocal } from "./local";

/**
 * Chooses path based on IMG_STORAGE_TYPE
 * @param selectedFiles
 * @returns uploaded img urls
 */
const uploadImg = async (selectedFiles: File[]): Promise<string[]> => {
  if (selectedFiles.length === 0) return [];

  let uploadedUrls: string[] = [];
  if (IMG_STORAGE_TYPE === "supabase") {
    uploadedUrls = await uploadImgToSubaBase(selectedFiles);
  } else if (IMG_STORAGE_TYPE === "local") {
    uploadedUrls = await uploadImgToLocal(selectedFiles);
  } else {
    throw new Error("Missing env variable IMG_STORAGE_TYPE");
  }

  return uploadedUrls;
};

/**
 * Chooses path based on IMG_STORAGE_TYPE
 * @param urlsToRemove
 * @returns void
 */
const deleteImg = async (urlsToRemove: string[]): Promise<void> => {
  if (urlsToRemove.length === 0) return;

  if (IMG_STORAGE_TYPE === "local" && urlsToRemove.length > 0) {
    await removeImgFromLocal(urlsToRemove);
  }
};

export const UtilsUploadRecipeImg = {
  uploadImg,
  deleteImg,
};
