import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/portfolio/portfolio-home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GHARSHAN — Websites That Help Small Businesses Grow" },
      {
        name: "description",
        content:
          "Freelance web development by Gharshan V: modern, responsive websites and landing pages for small businesses.",
      },
      { property: "og:title", content: "GHARSHAN — Freelance Web Developer" },
      {
        property: "og:description",
        content: "Modern, responsive websites and landing pages for small businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioHome,
});
