import { z } from "zod";

const slugSchema = z.string().trim().min(1, "Enter a slug").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");
const webUrlOrBlank = z.string().trim().max(2000).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}, "Enter a valid web address").transform((value) => value || null);
const textList = z.array(z.string().trim().min(1).max(300)).max(40);
const sortOrder = z.number().int().min(0).max(10000);

export const projectAdminSchema = z.object({
  title: z.string().trim().min(1).max(150),
  slug: slugSchema,
  category: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000),
  overview: z.string().trim().max(4000),
  problem: z.string().trim().max(4000),
  solution: z.string().trim().max(4000),
  contribution: z.string().trim().max(4000),
  tech_stack: textList,
  screenshots: textList,
  live_url: webUrlOrBlank,
  github_url: webUrlOrBlank,
  status: z.enum(["Completed", "In Progress", "Prototype"]),
  is_published: z.boolean(),
  sort_order: sortOrder,
});

export const serviceAdminSchema = z.object({
  title: z.string().trim().min(1).max(150),
  slug: slugSchema,
  description: z.string().trim().max(1000),
  icon: z.string().trim().min(1).max(40),
  features: textList,
  is_visible: z.boolean(),
  sort_order: sortOrder,
});

export const journeyAdminSchema = z.object({
  period: z.string().trim().max(100),
  title: z.string().trim().min(1).max(150),
  organization: z.string().trim().max(150),
  description: z.string().trim().max(2000),
  is_visible: z.boolean(),
  sort_order: sortOrder,
});