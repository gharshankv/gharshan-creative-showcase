# GHARSHAN portfolio and admin CMS

## What will be built
- Replace the starter screen with GHARSHAN’s public portfolio: sticky responsive navigation, service sections, published projects, journey, about, technology groups, conditional testimonials, validated inquiry form, and contact/footer details.
- Add project details, a public `/404` page, and a matching not-found screen for unknown URLs. Use only verified content; keep the supplied projects as unpublished drafts and hide testimonials until published.
- Add `/admin/login` and a protected `/admin` CMS for editing site settings, services, projects, journey, technologies, testimonials, and reviewing inquiries. No public sign-up.
- Store portfolio content and inquiries in Lovable Cloud, with public-read policies only for published/visible content, private inquiries, administrator-only edits, and a public media bucket with administrator-only uploads/deletes.
- Include a checked-in `supabase/schema.sql` for the requested schema reference, and apply the database changes through Lovable Cloud.

## Technical approach
- Keep this project on its supported TanStack Start and React 19 stack; use file-based TanStack routes instead of the requested React Router setup, and use existing shadcn controls plus Lucide icons.
- Use Cloud Auth email/password for the admin sign-in, disable public sign-up, validate the signed-in email against the single administrator allowlist, and enforce the same boundary in database policies.
- Keep the visual direction light, restrained, and personal. Use the requested copy, no invented contact details or claims, and no fabricated project results.
- Add route-specific metadata and tests for inquiry validation and route matching.

## Waiting on
- The profile-data answer determines whether an optional `profiles` table is needed. Public portfolio settings remain separate from individual account profiles.
- The administrator email is needed to finish the single-admin allowlist and confirm the protected login flow.
