import { describe, expect, it } from "vitest";

import { inquirySchema } from "@/lib/inquiry-validation";

describe("inquiry validation", () => {
  const validInquiry = {
    fullName: "Asha Rao",
    email: "asha@example.com",
    message: "I need a responsive website for my local business.",
  };

  it("requires a non-empty name", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, fullName: " " }).success).toBe(false);
  });

  it("requires a valid email address", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, email: "not-an-email" }).success).toBe(false);
  });

  it("requires a message of at least 20 characters", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, message: "Need a website." }).success).toBe(false);
  });

  it("accepts a complete valid inquiry", () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true);
  });
});