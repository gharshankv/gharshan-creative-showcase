import { describe, expect, it } from "vitest";
import {
  PROFILE_PHOTO_MAX_BYTES,
  isProfilePhotoStoragePath,
  profilePhotoObjectPath,
  profilePhotoValidationError,
} from "@/lib/profile-photo";

describe("profile photo validation", () => {
  it("accepts a supported image up to the existing 15 MB storage limit", () => {
    expect(profilePhotoValidationError({ type: "image/jpeg", size: PROFILE_PHOTO_MAX_BYTES })).toBeNull();
  });

  it("rejects an image larger than the existing 15 MB storage limit", () => {
    expect(profilePhotoValidationError({ type: "image/jpeg", size: PROFILE_PHOTO_MAX_BYTES + 1 })).toBe(
      "Choose an image no larger than 15 MB.",
    );
  });

  it("rejects file types that are not supported photo formats", () => {
    expect(profilePhotoValidationError({ type: "image/svg+xml", size: 1024 })).toBe(
      "Choose a JPEG, PNG, WebP, or AVIF image.",
    );
  });

  it("creates and recognizes only profile-scoped storage paths", () => {
    const path = profilePhotoObjectPath("image/webp", "photo_2026-01");
    expect(path).toBe("profile/photo_2026-01.webp");
    expect(path && isProfilePhotoStoragePath(path)).toBe(true);
    expect(isProfilePhotoStoragePath("profile/../private.webp")).toBe(false);
  });
});