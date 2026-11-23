-- GHARSHAN portfolio schema and reviewed starter content.
-- Apply the DDL through Lovable Cloud; seed inserts are included for portability.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE TABLE public.admin_users (
  email text PRIMARY KEY CHECK (length(trim(email)) > 3),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Globe2',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Business Websites',
  description text NOT NULL DEFAULT '',
  overview text NOT NULL DEFAULT '',
  problem text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  contribution text NOT NULL DEFAULT '',
  tech_stack text[] NOT NULL DEFAULT '{}',
  screenshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  live_url text,
  github_url text,
  status text NOT NULL DEFAULT 'Prototype',
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.journey (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL DEFAULT '',
  title text NOT NULL,
  organization text,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journey TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.journey TO authenticated;
GRANT ALL ON public.journey TO service_role;
ALTER TABLE public.journey ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Tools & Deployment',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, category)
);
GRANT SELECT ON public.technologies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.technologies TO authenticated;
GRANT ALL ON public.technologies TO service_role;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  organization text NOT NULL DEFAULT '',
  testimonial text NOT NULL,
  avatar_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(trim(full_name)) > 0),
  email text NOT NULL CHECK (length(trim(email)) > 3 AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  business_name text,
  service_needed text,
  budget_range text,
  timeline text,
  message text NOT NULL CHECK (length(trim(message)) >= 20),
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

CREATE POLICY "Admin can read their allowlist entry"
  ON public.admin_users FOR SELECT TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

CREATE POLICY "Public reads portfolio settings"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Administrator manages portfolio settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Public reads visible services"
  ON public.services FOR SELECT TO anon, authenticated
  USING (is_visible = true);
CREATE POLICY "Administrator manages services"
  ON public.services FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Public reads published projects"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (is_published = true);
CREATE POLICY "Administrator manages projects"
  ON public.projects FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Public reads visible journey entries"
  ON public.journey FOR SELECT TO anon, authenticated
  USING (is_visible = true);
CREATE POLICY "Administrator manages journey"
  ON public.journey FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Public reads visible technologies"
  ON public.technologies FOR SELECT TO anon, authenticated
  USING (is_visible = true);
CREATE POLICY "Administrator manages technologies"
  ON public.technologies FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Public reads published testimonials"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (is_published = true);
CREATE POLICY "Administrator manages testimonials"
  ON public.testimonials FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Visitors can submit inquiries"
  ON public.inquiries FOR INSERT TO anon
  WITH CHECK (
    length(trim(full_name)) > 0
    AND length(trim(message)) >= 20
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  );
CREATE POLICY "Administrator manages inquiries"
  ON public.inquiries FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Administrator uploads portfolio media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND private.is_admin());
CREATE POLICY "Administrator updates portfolio media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-media' AND private.is_admin())
  WITH CHECK (bucket_id = 'portfolio-media' AND private.is_admin());
CREATE POLICY "Administrator deletes portfolio media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-media' AND private.is_admin());

-- Starter values below are also applied through the database data tool.
INSERT INTO public.site_settings (key, value) VALUES
  ('profile', '{"name":"Gharshan V","title":"Freelance Web Developer","tagline":"Websites That Help Small Businesses Grow.","bio":"I''m Gharshan, a Computer Science student specializing in Artificial Intelligence and Machine Learning, with an interest in web development and building practical digital solutions.\n\nI enjoy exploring modern development tools, creating useful projects and turning ideas into functional digital experiences.\n\nMy goal is to help individuals and small businesses build a professional online presence through clean design and practical web solutions.","profile_image_url":"","education":"Computer Science student specializing in AI & ML","interests":"Web development, artificial intelligence, practical digital solutions","approach":"Clean design and practical web solutions"}'::jsonb),
  ('contact', '{"email":"","whatsapp_url":"","linkedin_url":"","github_url":"","resume_url":""}'::jsonb),
  ('availability', '{"enabled":false,"status_text":"Availability not set"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.services (title, slug, description, icon, features, sort_order, is_visible) VALUES
  ('Small Business Websites', 'small-business-websites', 'Professional multi-page websites for local businesses, clinics, cafes, personal brands and service providers.', 'Building2', '["Modern website design","Responsive layouts","Essential business information","Contact and inquiry options"]'::jsonb, 1, true),
  ('Landing Pages', 'landing-pages', 'Focused landing pages designed to communicate your offer clearly and encourage visitors to take action.', 'PanelsTopLeft', '["Clear messaging","Strong calls to action","Mobile-friendly layouts","Lead inquiry forms"]'::jsonb, 2, true),
  ('Website Redesign and Modernization', 'website-redesign-modernization', 'Improve an existing website with a cleaner design, better usability and a modern responsive experience.', 'RefreshCw', '["UI modernization","Responsive improvements","Layout improvements","Performance optimization where supported"]'::jsonb, 3, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (title, slug, category, description, overview, problem, solution, contribution, status, is_published, sort_order) VALUES
  ('Smart Project Evaluation Agent', 'smart-project-evaluation-agent', 'AI Applications', 'Draft project entry. Add a verified overview before publishing.', '', '', '', '', 'Prototype', false, 1),
  ('Women Safety Tracking System', 'women-safety-tracking-system', 'AI Applications', 'Draft project entry. Add a verified overview before publishing.', '', '', '', '', 'Prototype', false, 2),
  ('Customer Churn Prediction', 'customer-churn-prediction', 'AI Applications', 'Draft project entry. Add a verified overview before publishing.', '', '', '', '', 'Prototype', false, 3),
  ('Movie Recommendation System', 'movie-recommendation-system', 'AI Applications', 'Draft project entry. Add a verified overview before publishing.', '', '', '', '', 'Prototype', false, 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.journey (period, title, organization, description, sort_order, is_visible) VALUES
  ('', 'Bachelor of Engineering in Computer Science – AI & ML', '', 'Add institution, dates, and details once confirmed.', 1, false),
  ('', 'Academic & Personal Project Development', '', 'Add verified projects and dates in Admin.', 2, false),
  ('', 'AI Internship Experience', '', 'Add the organization, dates, and details once confirmed.', 3, false),
  ('', 'Freelance Web Development', '', 'Add verified client work and dates before publishing.', 4, false)
ON CONFLICT DO NOTHING;