import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Send,
  Smartphone,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry-validation";
import type {
  InquirySubmit,
  PortfolioData,
  PortfolioProject,
  PortfolioService,
} from "@/lib/portfolio-content";
import { defaultPortfolioData } from "@/lib/portfolio-content";

const navigation = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "work" },
  { label: "Contact", id: "contact" },
];

const projectCategories = ["All Projects", "Business Websites", "Landing Pages", "AI Applications"];

const budgetOptions = [
  "Under ₹15,000 / $200",
  "₹15,000 – ₹35,000 / $200 – $500",
  "₹35,000 – ₹75,000 / $500 – $1,000",
  "₹75,000+ / $1,000+",
  "Not sure yet",
];

type PortfolioHomeProps = {
  data?: PortfolioData;
  onInquirySubmit?: InquirySubmit;
};

function safeWebUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "GV";
}

function ProfileVisual({ data }: { data: PortfolioData }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [data.profile.profile_image_url]);

  return (
    <div className="mx-auto w-full max-w-[350px]">
      <div className="aspect-[4/5] overflow-hidden rounded-lg border border-border bg-secondary">
        {data.profile.profile_image_url && !imageFailed ? (
            <img
              src={data.profile.profile_image_url}
              alt={data.profile.name}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div role="img" aria-label="Profile photo not yet available" className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
              <UserRound className="size-10" aria-hidden="true" />
              <span className="text-sm">Profile photo not yet available</span>
            </div>
          )}
      </div>
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{data.profile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.profile.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">Websites, thoughtfully built.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-primary" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </div>
  );
}

function ServiceRow({
  service,
  index,
  onDiscuss,
}: {
  service: PortfolioService;
  index: number;
  onDiscuss: (serviceName: string) => void;
}) {
  return (
    <article className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-4 border-t border-border py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-8">
      <span className="pt-0.5 text-xl font-semibold text-primary sm:text-2xl" aria-label={`Service ${index + 1}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug text-foreground">{service.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
        {service.features.length ? <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {service.features.map((feature) => (
          <li className="flex items-baseline gap-2" key={feature}>
            <span className="text-primary" aria-hidden="true">•</span>{feature}
          </li>
        ))}
        </ul> : null}
      </div>
      <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
        <a href="#contact" aria-label={`Discuss ${service.title}`} onClick={() => onDiscuss(service.title)}>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </Button>
    </article>
  );
}

function ProjectEditorialRow({
  project,
  index,
  onView,
}: {
  project: PortfolioProject;
  index: number;
  onView: (project: PortfolioProject) => void;
}) {
  const liveUrl = safeWebUrl(project.live_url);
  const githubUrl = safeWebUrl(project.github_url);

  return (
    <article className="grid gap-4 border-t border-border py-7 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-8">
      <span className="text-2xl font-semibold text-primary sm:text-3xl" aria-label={`Project ${index + 1}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary/70" aria-hidden="true" />
            {project.status}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-foreground">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((technology) => (
            <span key={technology} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {technology}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 sm:justify-end sm:self-center">
          {liveUrl ? (
            <Button asChild size="sm" variant="ghost">
              <a href={liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" /> Live preview
              </a>
            </Button>
          ) : null}
          {githubUrl ? (
            <Button asChild size="sm" variant="ghost">
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <Github aria-hidden="true" /> GitHub
              </a>
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={() => onView(project)}>
            View details <ArrowUpRight aria-hidden="true" />
          </Button>
      </div>
    </article>
  );
}

function ContactLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
      className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
    >
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      {label}
    </a>
  );
}

export function PortfolioHome({ data = defaultPortfolioData, onInquirySubmit }: PortfolioHomeProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [formValues, setFormValues] = useState<Partial<InquiryInput>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const filteredProjects = useMemo(
    () =>
      selectedCategory === "All Projects"
        ? data.projects
        : data.projects.filter((project) => project.category === selectedCategory),
    [data.projects, selectedCategory],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );

    for (const item of navigation) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  const handleServiceDiscuss = (serviceName: string) => {
    setSelectedService(serviceName);
    setFormValues((current) => ({ ...current, serviceNeeded: serviceName }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("idle");
    const result = inquirySchema.safeParse(formValues);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    if (!onInquirySubmit) {
      setFormState("error");
      return;
    }
    setFormState("submitting");
    try {
      await onInquirySubmit(result.data);
      setFormValues({});
      setSelectedService("");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  const updateField = (field: keyof InquiryInput, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (formState !== "idle") setFormState("idle");
  };

  const contactEmail = data.contact.email.trim();
  const hasContactDetails =
    Boolean(contactEmail) ||
    Boolean(safeWebUrl(data.contact.whatsapp_url)) ||
    Boolean(safeWebUrl(data.contact.linkedin_url)) ||
    Boolean(safeWebUrl(data.contact.github_url));
  const statusText = data.availability.status_text.trim() || "Availability not set";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <a href="#home" className="shrink-0 text-base font-bold tracking-[0.14em] text-foreground" aria-label="GHARSHAN home">
            GHARSHAN<span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "location" : undefined}
                className={`text-sm transition-colors ${activeSection === item.id ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button asChild size="sm">
              <a href="#contact">Get a free quote <ArrowRight aria-hidden="true" /></a>
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileMenuOpen ? (
          <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={activeSection === item.id ? "location" : undefined}
                  className={`rounded-md px-3 py-2.5 text-sm ${activeSection === item.id ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground"}`}
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="mt-2 w-full">
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Get a free quote</a>
              </Button>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section id="home" className="scroll-mt-24 border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Freelance Web Developer
              </p>
              <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
                Websites That Help Small Businesses <span className="text-primary">Grow.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                I build modern, responsive websites and landing pages designed to give businesses a professional online presence and help them reach their goals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#work">View my projects <ArrowRight aria-hidden="true" /></a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#contact">Start a project</a>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Smartphone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>Mobile-responsive design</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>Modern user experience</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Code2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>Performance-focused development</span>
                </div>
              </div>
            </div>
            <ProfileVisual data={data} />
          </div>
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 pb-8 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:px-8 lg:px-10">
            <ArrowDown className="size-4 text-primary" aria-hidden="true" />
            Practical websites for growing businesses
          </div>
        </section>

        <section id="services" className="scroll-mt-24 bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Services</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                What I Can Build for Your Business
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Practical digital solutions designed to help businesses establish and improve their online presence.
              </p>
            </div>
            <div className="mt-12 border-b border-border">
              {data.services.map((service, index) => (
                <ServiceRow key={service.id} service={service} index={index} onDiscuss={handleServiceDiscuss} />
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Work</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">Selected Projects</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  A look at projects, experiments and digital solutions I&apos;ve worked on.
                </p>
              </div>
              <div className="flex max-w-full flex-wrap gap-2" role="tablist" aria-label="Filter projects">
                {projectCategories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            {filteredProjects.length ? (
              <div className="mt-10 border-b border-border">
                {filteredProjects.map((project, index) => (
                  <ProjectEditorialRow key={project.id} project={project} index={index} onView={setSelectedProject} />
                ))}
              </div>
            ) : (
              <div className="mt-10 border-y border-border py-12 text-center">
                <div className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-secondary text-primary">
                  <Layers3 className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-4 font-medium text-foreground">Verified work will appear here.</p>
                <p className="mt-1 text-sm text-muted-foreground">Projects are shared after their details are ready to publish.</p>
              </div>
            )}
          </div>
        </section>

        <section id="journey" className="scroll-mt-24 border-y border-border bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-10 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Journey</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">My Journey</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                A growing record of education, exploration and professional work.
              </p>
            </div>
            {data.journey.length ? (
              <ol className="relative space-y-8 border-l border-border pl-7">
                {data.journey.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[2.1rem] top-1.5 size-3 rounded-full border-2 border-primary bg-background" aria-hidden="true" />
                    {entry.period ? <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{entry.period}</p> : null}
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{entry.title}</h3>
                    {entry.organization ? <p className="mt-1 text-sm font-medium text-muted-foreground">{entry.organization}</p> : null}
                    {entry.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.description}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="border-l border-border py-2 pl-7 text-sm leading-6 text-muted-foreground">
                Confirmed milestones will be added as they are ready to share.
              </div>
            )}
          </div>
        </section>

        {data.testimonials.length ? (
          <section id="testimonials" className="scroll-mt-24">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Testimonials</p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">What People Say</h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {data.testimonials.map((testimonial) => (
                  <figure key={testimonial.id} className="border-t border-border pt-6">
                    <blockquote className="text-base leading-7 text-foreground">“{testimonial.testimonial}”</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      {testimonial.avatar_url ? (
                        <img src={testimonial.avatar_url} alt="" className="size-10 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary" aria-hidden="true">
                          {initials(testimonial.client_name)}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{testimonial.client_name}</span>
                        {testimonial.organization ? <span className="mt-0.5 block text-xs text-muted-foreground">{testimonial.organization}</span> : null}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="contact" className="scroll-mt-24 border-t border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">Have a Project in Mind?</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Tell me a little about your project. Let&apos;s discuss how I can help you build your online presence.
              </p>
            </div>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
              <form onSubmit={handleFormSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name <span className="text-destructive">*</span></Label>
                    <Input id="fullName" name="fullName" autoComplete="name" maxLength={100} value={formValues.fullName ?? ""} onChange={(event) => updateField("fullName", event.target.value)} aria-invalid={Boolean(fieldErrors["fullName"])} />
                    {fieldErrors["fullName"] ? <p className="text-xs text-destructive">{fieldErrors["fullName"]}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
                    <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} value={formValues.email ?? ""} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(fieldErrors["email"])} />
                    {fieldErrors["email"] ? <p className="text-xs text-destructive">{fieldErrors["email"]}</p> : null}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business name <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="businessName" name="businessName" maxLength={150} value={formValues.businessName ?? ""} onChange={(event) => updateField("businessName", event.target.value)} aria-invalid={Boolean(fieldErrors["businessName"])} />
                    {fieldErrors["businessName"] ? <p className="text-xs text-destructive">{fieldErrors["businessName"]}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Service needed</Label>
                    <Select
                      value={formValues.serviceNeeded || selectedService || "Other"}
                      onValueChange={(value) => {
                        setSelectedService(value === "Other" ? "" : value);
                        updateField("serviceNeeded", value);
                      }}
                    >
                      <SelectTrigger aria-label="Service needed"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {data.services.map((service) => <SelectItem key={service.id} value={service.title}>{service.title}</SelectItem>)}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Budget range</Label>
                    <Select value={formValues.budgetRange ?? ""} onValueChange={(value) => updateField("budgetRange", value)}>
                      <SelectTrigger aria-label="Budget range"><SelectValue placeholder="Choose a range" /></SelectTrigger>
                      <SelectContent>{budgetOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Project timeline <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="timeline" name="timeline" maxLength={100} placeholder="e.g. Flexible" value={formValues.timeline ?? ""} onChange={(event) => updateField("timeline", event.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Project description <span className="text-destructive">*</span></Label>
                  <Textarea id="message" name="message" minLength={20} maxLength={2000} rows={5} value={formValues.message ?? ""} onChange={(event) => updateField("message", event.target.value)} aria-invalid={Boolean(fieldErrors["message"])} />
                  <div className="flex items-center justify-between gap-4">
                    {fieldErrors["message"] ? <p className="text-xs text-destructive">{fieldErrors["message"]}</p> : <span className="text-xs text-muted-foreground">At least 20 characters</span>}
                    <span className="shrink-0 text-xs text-muted-foreground">{(formValues.message ?? "").length}/2000</span>
                  </div>
                </div>
                {formState === "success" ? (
                  <div role="status" className="rounded-md border border-primary/25 bg-background px-4 py-3 text-sm text-foreground">
                    Thanks for reaching out. Your inquiry has been received.
                  </div>
                ) : null}
                {formState === "error" ? (
                  <div role="alert" className="rounded-md border border-destructive/30 bg-background px-4 py-3 text-sm text-destructive">
                    Your inquiry could not be sent right now. Please try again later.
                  </div>
                ) : null}
                <Button type="submit" size="lg" disabled={formState === "submitting"}>
                  {formState === "submitting" ? <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" /> : <Send aria-hidden="true" />}
                  {formState === "submitting" ? "Sending…" : "Send inquiry"}
                </Button>
              </form>

              <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <h3 className="text-lg font-semibold text-foreground">Direct contact</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Prefer a direct message? Reach me through a configured channel.</p>
                {hasContactDetails ? (
                  <div className="mt-6 flex flex-col items-start gap-4">
                    {contactEmail.includes("@") ? <ContactLink href={`mailto:${contactEmail}`} label={contactEmail} icon={Mail} /> : null}
                    {safeWebUrl(data.contact.whatsapp_url) ? <ContactLink href={safeWebUrl(data.contact.whatsapp_url) ?? "#"} label="WhatsApp" icon={Smartphone} /> : null}
                    {safeWebUrl(data.contact.linkedin_url) ? <ContactLink href={safeWebUrl(data.contact.linkedin_url) ?? "#"} label="LinkedIn" icon={Linkedin} /> : null}
                    {safeWebUrl(data.contact.github_url) ? <ContactLink href={safeWebUrl(data.contact.github_url) ?? "#"} label="GitHub" icon={Github} /> : null}
                  </div>
                ) : (
                  <p className="mt-6 rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    Direct contact links will appear here when configured.
                  </p>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-10">
          <div>
            <a href="#home" className="text-sm font-bold tracking-[0.14em] text-foreground">GHARSHAN<span className="text-primary">.</span></a>
            <p className="mt-2 text-sm text-muted-foreground">Websites That Help Small Businesses Grow.</p>
            <p className="mt-5 text-xs text-muted-foreground">© {new Date().getFullYear()} Gharshan V. All rights reserved.</p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
              {navigation.filter((item) => item.id !== "home").map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-xs text-muted-foreground hover:text-foreground">{item.label}</a>
              ))}
            </nav>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${data.availability.enabled ? "border-primary/25 bg-accent text-accent-foreground" : "border-border text-muted-foreground"}`}>
              <span className={`size-1.5 rounded-full ${data.availability.enabled ? "bg-primary" : "bg-muted-foreground/50"}`} aria-hidden="true" />
              {statusText}
            </span>
          </div>
        </div>
      </footer>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProject(null); }}>
        {selectedProject ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{selectedProject.category}</span>
                <span className="text-xs text-muted-foreground">{selectedProject.status}</span>
              </div>
              <DialogTitle className="pt-2 text-2xl">{selectedProject.title}</DialogTitle>
            </DialogHeader>
            {selectedProject.screenshots.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedProject.screenshots.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${selectedProject.title} screenshot ${index + 1}`} className="aspect-video w-full rounded-md border border-border object-cover" />
                ))}
              </div>
            ) : null}
            <p className="text-sm leading-6 text-muted-foreground">{selectedProject.overview || selectedProject.description}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {selectedProject.problem ? <div><h3 className="text-sm font-semibold text-foreground">Problem being addressed</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedProject.problem}</p></div> : null}
              {selectedProject.solution ? <div><h3 className="text-sm font-semibold text-foreground">Proposed solution</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedProject.solution}</p></div> : null}
              {selectedProject.contribution ? <div><h3 className="text-sm font-semibold text-foreground">My contribution</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedProject.contribution}</p></div> : null}
            </div>
            {selectedProject.tech_stack.length ? (
              <div><h3 className="text-sm font-semibold text-foreground">Technologies used</h3><div className="mt-2 flex flex-wrap gap-2">{selectedProject.tech_stack.map((tech) => <span key={tech} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{tech}</span>)}</div></div>
            ) : null}
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {safeWebUrl(selectedProject.live_url) ? <Button asChild variant="outline"><a href={safeWebUrl(selectedProject.live_url) ?? "#"} target="_blank" rel="noreferrer">Live preview <ExternalLink aria-hidden="true" /></a></Button> : null}
              {safeWebUrl(selectedProject.github_url) ? <Button asChild variant="outline"><a href={safeWebUrl(selectedProject.github_url) ?? "#"} target="_blank" rel="noreferrer">GitHub <Github aria-hidden="true" /></a></Button> : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}