import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/portfolio/portfolio-home";
import { getPortfolioData } from "@/lib/portfolio-data.functions";
import { submitInquiry } from "@/lib/inquiry-submit";
import { NotFoundPage } from "@/components/not-found-page";

const portfolioQueryOptions = queryOptions({
  queryKey: ["portfolio", "public"],
  queryFn: () => getPortfolioData(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQueryOptions),
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
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">The portfolio couldn’t load.</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Please try again shortly."}</p>
      </div>
    </main>
  ),
  notFoundComponent: () => <NotFoundPage />,
  component: PortfolioRoute,
});

function PortfolioRoute() {
  const { data } = useSuspenseQuery(portfolioQueryOptions);
  return <PortfolioHome data={data} onInquirySubmit={submitInquiry} />;
}
