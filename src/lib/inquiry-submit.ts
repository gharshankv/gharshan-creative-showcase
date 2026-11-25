import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import type { InquiryInput } from "@/lib/inquiry-validation";

function optionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toInquiryInsert(input: InquiryInput): TablesInsert<"inquiries"> {
  return {
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    business_name: optionalText(input.businessName),
    service_needed: optionalText(input.serviceNeeded),
    budget_range: optionalText(input.budgetRange),
    timeline: optionalText(input.timeline),
    message: input.message.trim(),
  };
}

export async function submitInquiry(input: InquiryInput): Promise<void> {
  const { error } = await supabase.from("inquiries").insert(toInquiryInsert(input));
  if (error) throw error;
}