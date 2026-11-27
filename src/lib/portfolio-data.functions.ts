import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import {
  isProfilePhotoStoragePath,
  PROFILE_PHOTO_BUCKET,
  PROFILE_PHOTO_SIGNED_URL_SECONDS,
} from "@/lib/profile-photo";
import {
  defaultPortfolioData,
  type AvailabilitySettings,
  type ContactSettings,
  type PortfolioData,
  type ProfileSettings,
} from "@/lib/portfolio-content";

function createPublicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Portfolio data is temporarily unavailable.");

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function asObject(value: Json | null | undefined): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function readString(value: Json | undefined, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readStringList(value: Json | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function settingsFromRows(rows: Array<{ key: string; value: Json }>): Pick<PortfolioData, "profile" | "contact" | "availability"> {
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const profile = asObject(values.get("profile"));
  const contact = asObject(values.get("contact"));
  const availability = asObject(values.get("availability"));

  const profileSettings: ProfileSettings = {
    name: readString(profile["name"], defaultPortfolioData.profile.name),
    title: readString(profile["title"], defaultPortfolioData.profile.title),
    tagline: readString(profile["tagline"], defaultPortfolioData.profile.tagline),
    bio: readString(profile["bio"], defaultPortfolioData.profile.bio),
    profile_image_url: readString(profile["profile_image_url"], ""),
    education: readString(profile["education"], defaultPortfolioData.profile.education),
    interests: readString(profile["interests"], defaultPortfolioData.profile.interests),
    approach: readString(profile["approach"], defaultPortfolioData.profile.approach),
  };
  const contactSettings: ContactSettings = {
    email: readString(contact["email"], ""),
    whatsapp_url: readString(contact["whatsapp_url"], ""),
    linkedin_url: readString(contact["linkedin_url"], ""),
    github_url: readString(contact["github_url"], ""),
    resume_url: readString(contact["resume_url"], ""),
  };
  const availabilitySettings: AvailabilitySettings = {
    enabled: availability["enabled"] === true,
    status_text: readString(availability["status_text"], defaultPortfolioData.availability.status_text),
  };

  return { profile: profileSettings, contact: contactSettings, availability: availabilitySettings };
}

export const getPortfolioData = createServerFn({ method: "GET" }).handler(async () => {
  const client = createPublicClient();
  const [servicesResult, projectsResult, journeyResult, technologiesResult, testimonialsResult, settingsResult] =
    await Promise.all([
      client.from("services").select("*").order("sort_order"),
      client.from("projects").select("*").order("sort_order"),
      client.from("journey").select("*").order("sort_order"),
      client.from("technologies").select("*").order("sort_order"),
      client.from("testimonials").select("*").order("sort_order"),
      client.from("site_settings").select("key, value"),
    ]);

  const results = [servicesResult, projectsResult, journeyResult, technologiesResult, testimonialsResult, settingsResult];
  const failedResult = results.find((result) => result.error);
  if (failedResult?.error) throw new Error("Portfolio data is temporarily unavailable.");

  const settings = settingsFromRows(settingsResult.data ?? []);
  let profileImageUrl = settings.profile.profile_image_url;
  if (profileImageUrl.startsWith("profile/")) {
    if (!isProfilePhotoStoragePath(profileImageUrl)) {
      profileImageUrl = "";
    } else {
      try {
        const { data: signedImage, error: signError } = await client.storage
          .from(PROFILE_PHOTO_BUCKET)
          .createSignedUrl(profileImageUrl, PROFILE_PHOTO_SIGNED_URL_SECONDS);
        profileImageUrl = signError ? "" : signedImage.signedUrl;
      } catch {
        profileImageUrl = "";
      }
    }
  }
  return {
    ...settings,
    profile: { ...settings.profile, profile_image_url: profileImageUrl },
    services: (servicesResult.data ?? []).map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      features: readStringList(service.features),
      sort_order: service.sort_order,
    })),
    projects: (projectsResult.data ?? []).map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      overview: project.overview,
      problem: project.problem,
      solution: project.solution,
      contribution: project.contribution,
      tech_stack: project.tech_stack,
      screenshots: readStringList(project.screenshots),
      live_url: project.live_url,
      github_url: project.github_url,
      status: project.status,
    })),
    journey: (journeyResult.data ?? []).map((entry) => ({
      id: entry.id,
      period: entry.period,
      title: entry.title,
      organization: entry.organization,
      description: entry.description,
      sort_order: entry.sort_order,
    })),
    technologies: (technologiesResult.data ?? []).map((technology) => ({
      id: technology.id,
      name: technology.name,
      category: technology.category,
      sort_order: technology.sort_order,
    })),
    testimonials: (testimonialsResult.data ?? []).map((testimonial) => ({
      id: testimonial.id,
      client_name: testimonial.client_name,
      organization: testimonial.organization,
      testimonial: testimonial.testimonial,
      avatar_url: testimonial.avatar_url,
      sort_order: testimonial.sort_order,
    })),
  } satisfies PortfolioData;
});