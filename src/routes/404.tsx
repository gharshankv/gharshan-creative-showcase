import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/not-found-page";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page not found | GHARSHAN" },
      { name: "description", content: "The page you requested could not be found. Return to GHARSHAN’s portfolio." },
      { property: "og:title", content: "Page not found | GHARSHAN" },
      { property: "og:description", content: "The page you requested could not be found. Return to GHARSHAN’s portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotFoundPage,
});