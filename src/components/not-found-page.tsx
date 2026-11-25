import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-lg border border-border bg-secondary text-primary">
          <Compass className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase text-primary">404 · Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">This page isn’t here.</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
          The page may have moved, or the address may be incorrect.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">
            <ArrowLeft aria-hidden="true" /> Back to GHARSHAN
          </Link>
        </Button>
      </div>
    </main>
  );
}