import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard, adminDataQueryOptions } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { getAllowlistedAdminEmail } from "@/lib/admin-access";
import { supabase } from "@/integrations/supabase/client";
import { NotFoundPage } from "@/components/not-found-page";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    const email = await getAllowlistedAdminEmail();
    if (!email) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login" });
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(adminDataQueryOptions),
  head: () => ({
    meta: [
      { title: "Admin workspace | GHARSHAN" },
      { name: "description", content: "Private portfolio and inquiry management for GHARSHAN." },
      { property: "og:title", content: "Admin workspace | GHARSHAN" },
      { property: "og:description", content: "Private portfolio and inquiry management for GHARSHAN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">The admin workspace couldn’t load.</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p>
        <Button className="mt-5" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    </main>
  ),
  notFoundComponent: () => <NotFoundPage />,
  component: AdminDashboard,
});