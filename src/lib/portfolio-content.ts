import type { InquiryInput } from "@/lib/inquiry-validation";

export type PortfolioService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  sort_order: number;
};

export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  contribution: string;
  tech_stack: string[];
  screenshots: string[];
  live_url: string | null;
  github_url: string | null;
  status: string;
};

export type JourneyEntry = {
  id: string;
  period: string;
  title: string;
  organization: string | null;
  description: string;
  sort_order: number;
};

export type Technology = {
  id: string;
  name: string;
  category: string;
  sort_order: number;
};

export type PortfolioTestimonial = {
  id: string;
  client_name: string;
  organization: string;
  testimonial: string;
  avatar_url: string | null;
  sort_order: number;
};

export type ProfileSettings = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  profile_image_url: string;
  education: string;
  interests: string;
  approach: string;
};

export type ContactSettings = {
  email: string;
  whatsapp_url: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
};

export type AvailabilitySettings = {
  enabled: boolean;
  status_text: string;
};

export type PortfolioData = {
  profile: ProfileSettings;
  contact: ContactSettings;
  availability: AvailabilitySettings;
  services: PortfolioService[];
  projects: PortfolioProject[];
  journey: JourneyEntry[];
  technologies: Technology[];
  testimonials: PortfolioTestimonial[];
};

export type InquirySubmit = (inquiry: InquiryInput) => Promise<void>;

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "Gharshan V",
    title: "Freelance Web Developer",
    tagline: "Websites That Help Small Businesses Grow.",
    bio: "I'm Gharshan, a Computer Science student specializing in Artificial Intelligence and Machine Learning, with an interest in web development and building practical digital solutions.\n\nI enjoy exploring modern development tools, creating useful projects and turning ideas into functional digital experiences.\n\nMy goal is to help individuals and small businesses build a professional online presence through clean design and practical web solutions.",
    profile_image_url: "",
    education: "Computer Science student specializing in AI & ML",
    interests: "Web development, artificial intelligence, practical digital solutions",
    approach: "Clean design and practical web solutions",
  },
  contact: {
    email: "",
    whatsapp_url: "",
    linkedin_url: "",
    github_url: "",
    resume_url: "",
  },
  availability: {
    enabled: false,
    status_text: "Availability not set",
  },
  services: [
    {
      id: "small-business-websites",
      title: "Small Business Websites",
      slug: "small-business-websites",
      description:
        "Professional multi-page websites for local businesses, clinics, cafes, personal brands and service providers.",
      icon: "Building2",
      features: [
        "Modern website design",
        "Responsive layouts",
        "Essential business information",
        "Contact and inquiry options",
      ],
      sort_order: 1,
    },
    {
      id: "landing-pages",
      title: "Landing Pages",
      slug: "landing-pages",
      description:
        "Focused landing pages designed to communicate your offer clearly and encourage visitors to take action.",
      icon: "PanelsTopLeft",
      features: [
        "Clear messaging",
        "Strong calls to action",
        "Mobile-friendly layouts",
        "Lead inquiry forms",
      ],
      sort_order: 2,
    },
    {
      id: "website-redesign-modernization",
      title: "Website Redesign and Modernization",
      slug: "website-redesign-modernization",
      description:
        "Improve an existing website with a cleaner design, better usability and a modern responsive experience.",
      icon: "RefreshCw",
      features: [
        "UI modernization",
        "Responsive improvements",
        "Layout improvements",
        "Performance optimization where supported",
      ],
      sort_order: 3,
    },
  ],
  projects: [],
  journey: [],
  technologies: [],
  testimonials: [],
};