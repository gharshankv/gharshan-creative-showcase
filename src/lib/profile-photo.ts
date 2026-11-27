export const PROFILE_PHOTO_BUCKET = "portfolio-media";
export const PROFILE_PHOTO_MAX_BYTES = 15 * 1024 * 1024;
export const PROFILE_PHOTO_SIGNED_URL_SECONDS = 604_800;

const supportedPhotoExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function profilePhotoObjectPath(type: string, id: string): string | null {
  const extension = supportedPhotoExtensions[type];
  return extension && /^[a-zA-Z0-9_-]+$/.test(id) ? `profile/${id}.${extension}` : null;
}

export function isProfilePhotoStoragePath(value: string): boolean {
  return /^profile\/[a-zA-Z0-9_-]+\.(?:jpg|png|webp|avif)$/i.test(value);
}

export function profilePhotoValidationError(file: Pick<File, "type" | "size">): string | null {
  if (!supportedPhotoExtensions[file.type]) {
    return "Choose a JPEG, PNG, WebP, or AVIF image.";
  }
  if (file.size <= 0) {
    return "Choose a non-empty image.";
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    return "Choose an image no larger than 15 MB.";
  }
  return null;
}