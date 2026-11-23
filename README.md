# Gharshan Creative Showcase

Use this prompt 
# MASTER PROMPT: Build a Premium Freelance Portfolio Website & Admin CMS – GHARSHAN
Build a complete, production-ready, responsive freelance web developer portfolio and private Content Management System (CMS) for **GHARSHAN (Gharshan V)**.
The project must include two distinct, connected parts in the same codebase:
1. **Public Portfolio Website** (`/`, plus project detail views/modals and a custom `/404` page)
2. **Secure Private Admin Dashboard** (`/admin` and `/admin/login`)
---
## 1. TECH STACK & ARCHITECTURE
- **Framework:** React 18+ with TypeScript (Vite)
- **Routing:** React Router (`react-router-dom`) for clean client-side routing (`/`, `/admin`, `/admin/login`, `*` 404 fallback)
- **Styling:** Tailwind CSS + `Inter` Google Font
- **Icons:** `lucide-react`
- **Backend / Database / Auth / Storage:** Supabase (`@supabase/supabase-js`)
- **Deployment Target:** GitHub-compatible repository + Netlify-compatible configuration (include `public/_redirects` with `/* /index.html 200` so `/admin` and deep routes work on page refresh)
---
## 2. BRAND IDENTITY, POSITIONING & HONESTY GUARDRAILS
- **Brand Name:** GHARSHAN
- **Professional Title:** Freelance Web Developer
- **Primary Tagline:** "Websites That Help Small Businesses Grow."
- **Supporting Description:** "I create modern, responsive websites and landing pages that help businesses establish their online presence and connect with more customers."
- **Positioning:** Position strictly as a dedicated, trustworthy **individual freelance developer**, never as an agency.
- **Strict Honesty Rule:** Do NOT invent client experience, fake testimonials, artificial business metrics, guaranteed SEO rankings, guaranteed delivery times, or skill percentage bars. Use clean, clearly labeled placeholders where data is pending.
---
## 3. VISUAL DESIGN SYSTEM – PREMIUM LIGHT MINIMALISM
Implement a clean, modern SaaS-inspired light minimalist aesthetic:
- **Primary Background:** `#FFFFFF`
- **Secondary Background:** `#F8FAFC`
- **Primary Accent:** `#2563EB` (Hover: `#1D4ED8`)
- **Main Text:** `#172033`
- **Secondary Text:** `#64748B`
- **Borders:** `#E2E8F0`
- **Typography:** `Inter` with strong typographic hierarchy, generous whitespace, balanced max-width containers (`max-w-6xl` / `max-w-7xl`), crisp `1px solid #E2E8F0` borders, rounded cards (`rounded-xl`), and soft diffused shadows (`shadow-sm`).
- **Strict Visual Exclusions:** NO heavy dark backgrounds, NO neon colors, NO excessive gradients, NO heavy glassmorphism, NO distracting animations, and NO non-functional decorative controls.
---
## 4. PUBLIC WEBSITE SECTIONS & REQUIREMENTS
### A. Sticky Header & Navigation
- **Left:** Clean text-based `GHARSHAN` logo.
- **Center Links:** `Home`, `Services`, `Work`, `Journey`, `About`, `Contact` (with smooth scrolling and active section highlighting via IntersectionObserver).
- **Right:** Primary CTA button `"Get a Free Quote"` (scrolls smoothly to Contact form).
- **Mobile:** Accessible responsive hamburger menu drawer.
### B. Hero Section
- Introductory badge/label: `"Freelance Web Developer"`
- Main Headline (`h1`): `"Websites That Help Small Businesses Grow."`
- Supporting Paragraph: `"I build modern, responsive websites and landing pages designed to give businesses a professional online presence and help them reach their goals."`
- **Two Prominent CTAs:**
  1. `"View My Projects"` (Primary `#2563EB` button → scrolls to `#work`)
  2. `"Start a Project"` (Secondary bordered button → scrolls to `#contact`)
- **Trust Highlights (3 subtle items with minimal icons):**
  - Mobile-Responsive Design
  - Modern User Experience
  - Performance-Focused Development
- **Visual:** Clean, framed professional profile image placeholder (dynamically loaded from Supabase profile settings, with an elegant initials/monogram fallback if no photo is uploaded yet).
### C. Services Section (`#services`)
- **Heading:** `"What I Can Build for Your Business"`
- **Subheading:** `"Practical digital solutions designed to help businesses establish and improve their online presence."`
- Dynamically fetched from Supabase `services` table (filtered by `is_visible = true`), seeded with 3 core cards:
  1. **Small Business Websites:** "Professional multi-page websites for local businesses, clinics, cafes, personal brands and service providers." Features: Modern website design, Responsive layouts, Essential business information, Contact and inquiry options.
  2. **Landing Pages:** "Focused landing pages designed to communicate your offer clearly and encourage visitors to take action." Features: Clear messaging, Strong calls to action, Mobile-friendly layouts, Lead inquiry forms.
  3. **Website Redesign and Modernization:** "Improve an existing website with a cleaner design, better usability and a modern responsive experience." Features: UI modernization, Responsive improvements, Layout improvements, Performance optimization where supported.
- Each card includes a minimal Lucide icon, bulleted features, and a `"Discuss Your Project"` link that scrolls to `#contact` and pre-selects that service in the inquiry form dropdown.
### D. Featured Projects Section (`#work`)
- **Heading:** `"Selected Projects"`
- **Subheading:** `"A look at projects, experiments and digital solutions I've worked on."`
- **Category Filter Tabs:** `All Projects`, `Business Websites`, `Landing Pages`, `AI Applications` (rendered cleanly from published database items).
- **Project Cards:** High-quality screenshot (or clean architectural placeholder if image is missing), Title, Category badge, Short description, Tech stack tags, Project status badge (e.g., `Completed`, `In Progress`, `Prototype`), `"Live Preview"` button (rendered ONLY if `live_url` is present), `"GitHub"` button (rendered ONLY if `github_url` is present), and `"View Details"` button.
- **Project Detail Modal / Drawer:** Displays full Project Overview, Problem Being Addressed, Proposed Solution, My Contribution, Technologies Used, Screenshots, and working Demo/GitHub links.
- **Initial Database Seed (Draft/Unpublished by default or clearly marked until verified in Admin):**
  - *Smart Project Evaluation Agent* (AI Applications)
  - *Women Safety Tracking System* (AI Applications)
  - *Customer Churn Prediction* (AI Applications)
  - *Movie Recommendation System* (AI Applications)
### E. My Journey Section (`#journey`)
- **Heading:** `"My Journey"`
- Clean vertical timeline dynamically loaded from Supabase `journey` table, ordered chronologically.
- Displays: Date/Period (when known), Title, Organization/Institution (where applicable), and Short Description.
- Seed with honest baseline placeholders ready to be edited in Admin (e.g., Bachelor of Engineering in Computer Science – AI & ML, Academic & Personal Project Development, AI Internship Experience, Freelance Web Development).
### F. About Section (`#about`)
- **Heading:** `"A Little About Me"`
- **Default Bio (editable in Admin):**
  > "I'm Gharshan, a Computer Science student specializing in Artificial Intelligence and Machine Learning, with an interest in web development and building practical digital solutions.
  >
  > I enjoy exploring modern development tools, creating useful projects and turning ideas into functional digital experiences.
  >
  > My goal is to help individuals and small businesses build a professional online presence through clean design and practical web solutions."
- Includes Profile Image, Educational Background summary, Areas of Interest, Professional Approach, and working GitHub, LinkedIn, and Resume download links (only shown when URLs/files are configured in Admin).
### G. Tools & Technologies Section
- **Heading:** `"Tools & Technologies"`
- Clean categorized tags/pills (e.g., Frontend, Backend & Database, AI & Data, Tools & Deployment) managed dynamically via Supabase `technologies` table.
- **Strictly NO percentage bars or fake mastery ratings.**
### H. Testimonials & Trust Section (`#testimonials`)
- **Heading:** `"What People Say"`
- Displays Client Name, Business/Organization, Testimonial text, and optional avatar.
- **CRITICAL CONDITIONAL RULE:** Query published testimonials (`is_published = true`). **If 0 published testimonials exist, completely hide/unmount the entire Testimonials section** from the DOM so no empty state or fake reviews appear.
### I. Project Inquiry & Contact Section (`#contact`)
- **Heading:** `"Have a Project in Mind?"`
- **Subheading:** `"Tell me a little about your project. Let's discuss how I can help you build your online presence."`
- **Inquiry Form Fields:**
  - Full Name (required)
  - Email Address (required, validated email format)
  - Business Name (optional)
  - Service Needed (dropdown populated from active services + "Other")
  - Budget Range (dropdown: e.g., "Under ₹15,000 / $200", "₹15,000 – ₹35,000 / $200 – $500", "₹35,000 – ₹75,000 / $500 – $1,000", "₹75,000+ / $1,000+", "Not sure yet")
  - Project Timeline (optional dropdown/input)
  - Project Description / Message (required, minimum 20 characters)
- **Form UX & Security:** Client-side validation, loading spinner state, disabled submit button while submitting (prevents duplicate submissions), clear inline success/error banners, inserts directly into Supabase `inquiries` table.
- **Direct Contact Sidebar:** Email, WhatsApp, LinkedIn, and GitHub links pulled dynamically from `site_settings` (hide or show configurable placeholder state if unconfigured; never invent fake phone numbers or emails).
### J. Footer
- `GHARSHAN` branding + short tagline.
- Quick navigation links + social links + email contact.
- Dynamic copyright year (`new Date().getFullYear()`).
- **Live Availability Indicator Pill:** e.g., green dot + `"Available for New Projects"` (editable text and status toggle in Admin `site_settings`).
---
## 5. SECURE PRIVATE ADMIN DASHBOARD (`/admin`)
Create a clean, light-minimalist sidebar dashboard layout at `/admin` protected by Supabase Auth.
### Authentication & Security Architecture
- **Login Page (`/admin/login`):** Email + password login only. **No public sign-up form.**
- **Route Protection:** Wrap `/admin` in a `<ProtectedRoute>` component checking active Supabase session AND verifying the authenticated user's email matches `import.meta.env.VITE_ADMIN_EMAIL` (or an `admin_users` allowlist check).
- **Supabase Database & RLS Setup:** Provide a complete `supabase/schema.sql` file containing:
  1. Tables: `site_settings`, `services`, `projects`, `journey`, `technologies`, `testimonials`, `inquiries`
  2. RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) on **every** table.
  3. **Public (`anon`) Policies:**
     - `SELECT` allowed ONLY on published/visible rows (`is_published = true` / `is_visible = true`) for `projects`, `services`, `testimonials`, and `SELECT` on `site_settings`, `journey`, `technologies`.
     - `INSERT` allowed on `inquiries` (with basic check constraints on non-empty name, email, message) — `anon` CANNOT `SELECT`, `UPDATE`, or `DELETE` inquiries.
  4. **Admin (`authenticated`) Policies:**
     - Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` restricted strictly via `(SELECT auth.jwt() ->> 'email') = '<ADMIN_EMAIL>'` (or a `SECURITY DEFINER` `private.is_admin()` helper function) so no unauthorized authenticated user can modify data.
  5. **Supabase Storage Buckets:** `portfolio-media` (public read, admin-only upload/delete) for profile photos, project screenshots, and resume PDFs

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36ea972f-5e6e-4c6f-8f38-4be154519f5c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
