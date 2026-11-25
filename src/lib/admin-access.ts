import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "gharshankv123@gmail.com";

export function matchesAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

export async function isAllowlistedAdmin(email: string | null | undefined): Promise<boolean> {
  if (!matchesAdminEmail(email)) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", ADMIN_EMAIL)
    .maybeSingle();

  return !error && data !== null;
}

export async function getAllowlistedAdminEmail(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (error || !email || !(await isAllowlistedAdmin(email))) return null;
  return email;
}