import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL, getAllowlistedAdminEmail, isAllowlistedAdmin } from "@/lib/admin-access";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in | GHARSHAN" },
      { name: "description", content: "Secure sign-in for the GHARSHAN portfolio administrator." },
      { property: "og:title", content: "Admin sign in | GHARSHAN" },
      { property: "og:description", content: "Secure sign-in for the GHARSHAN portfolio administrator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void getAllowlistedAdminEmail().then(async (email) => {
      if (active && email) await navigate({ to: "/admin", replace: true });
    });
    return () => { active = false; };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) {
        setErrorMessage("That email and password combination couldn’t be verified.");
        return;
      }
      const allowed = await isAllowlistedAdmin(data.user.email);
      if (!allowed) {
        await supabase.auth.signOut();
        setErrorMessage("This account isn’t authorized to manage the portfolio.");
        return;
      }
      await navigate({ to: "/admin", replace: true });
    } catch {
      setErrorMessage("Sign-in is temporarily unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/60 px-5 py-12 text-foreground">
      <section className="w-full max-w-md border border-border bg-background p-7 shadow-sm sm:p-9">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> GHARSHAN</Link>
        <div className="mt-9 grid size-11 place-items-center rounded-lg border border-border bg-secondary text-primary"><LockKeyhole className="size-5" aria-hidden="true" /></div>
        <p className="mt-6 text-xs font-semibold uppercase text-primary">Private access</p>
        <h1 className="mt-2 text-3xl font-semibold">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in with the administrator account to manage portfolio content and inquiries.</p>
        <form className="mt-8 space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2"><Label htmlFor="admin-email">Email address</Label><Input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          {errorMessage ? <p role="alert" className="border-l-2 border-destructive px-3 py-2 text-sm text-destructive">{errorMessage}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</Button>
        </form>
      </section>
    </main>
  );
}