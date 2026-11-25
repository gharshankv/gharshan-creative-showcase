import { describe, expect, it } from "vitest";
import { matchesAdminEmail } from "@/lib/admin-access";

describe("admin allowlist email check", () => {
  it("accepts only the configured administrator email, case-insensitively", () => {
    expect(matchesAdminEmail("GharshanKV123@gmail.com")).toBe(true);
    expect(matchesAdminEmail("gharshanv123@gmail.com")).toBe(false);
    expect(matchesAdminEmail(null)).toBe(false);
  });
});