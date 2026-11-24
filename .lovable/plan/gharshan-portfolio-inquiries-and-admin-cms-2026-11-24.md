# GHARSHAN portfolio, inquiries, and admin CMS

## What will be built
- Connect the public portfolio to Lovable Cloud, submit validated inquiries that are stored privately, and seed the reviewed portfolio content.
- Add private account profiles and a single administrator allowlist for gharshankv123@gmail.com; build `/admin/login` and a protected `/admin` dashboard for portfolio content and inquiry management.
- Add a custom `/404` page and ensure every content route has its own share metadata.
- Keep media storage unchanged because public bucket access was previously blocked.

## Technical details
- Use additive Lovable Cloud schema changes with explicit grants and row-level policies; keep inquiry reads and content edits restricted to the approved administrator.
- Use email/password sign-in with public sign-up disabled, profile creation on signup, and server-validated admin access.
- Keep the existing TanStack Start route structure and project design system; add focused tests for inquiry constraints and route coverage.
- Apply schema through the database migration tool and seed starter rows through the supported data workflow.

## Waiting on
- Nothing; the admin email and profile-storage preference are confirmed.
