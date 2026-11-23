import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name").max(100, "Name must be 100 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email must be 255 characters or fewer"),
  businessName: z.string().trim().max(150, "Business name must be 150 characters or fewer").optional(),
  serviceNeeded: z.string().trim().max(120).optional(),
  budgetRange: z.string().trim().max(100).optional(),
  timeline: z.string().trim().max(100).optional(),
  message: z.string().trim().min(20, "Tell me a little more (at least 20 characters)").max(2000, "Message must be 2,000 characters or fewer"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;