import { useState, type FormEvent, type ReactNode } from "react";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Check,
  ClipboardList,
  ExternalLink,
  LogOut,
  Pencil,
  Plus,
  Settings2,
  Trash2,
  Waypoints,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import {
  journeyAdminSchema,
  projectAdminSchema,
  serviceAdminSchema,
} from "@/lib/admin-validation";
import { defaultPortfolioData } from "@/lib/portfolio-content";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type Inquiry = Tables<"inquiries">;
type Project = Tables<"projects">;
type Service = Tables<"services">;
type Journey = Tables<"journey">;
type Setting = Tables<"site_settings">;
type Panel = "inquiries" | "projects" | "services" | "journey" | "settings";
type EditorKind = "project" | "service" | "journey";
type EditorState = { kind: EditorKind; id: string | null; values: Record<string, string | boolean> };
type Notice = { kind: "success" | "error"; text: string };

export const adminDataQueryOptions = queryOptions({
  queryKey: ["admin", "portfolio-data"],
  queryFn: async () => {
    const [inquiries, projects, services, journey, settings] = await Promise.all([
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("journey").select("*").order("sort_order"),
      supabase.from("site_settings").select("*").order("key"),
    ]);
    const results = [inquiries, projects, services, journey, settings];
    const failed = results.find((result) => result.error);
    if (failed?.error) throw new Error("Could not load the admin workspace. Please try again.");
    return {
      inquiries: inquiries.data ?? [],
      projects: projects.data ?? [],
      services: services.data ?? [],
      journey: journey.data ?? [],
      settings: settings.data ?? [],
    };
  },
});

const panels: Array<{ id: Panel; label: string; icon: typeof ClipboardList }> = [
  { id: "inquiries", label: "Inquiries", icon: ClipboardList },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "services", label: "Services", icon: Settings2 },
  { id: "journey", label: "Journey", icon: Waypoints },
  { id: "settings", label: "Site settings", icon: Settings2 },
];

const inquiryStatuses = ["new", "reviewing", "responded", "closed"] as const;

function arrayFromJson(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function settingObject(setting: Setting | undefined): Record<string, Json | undefined> {
  return setting?.value && typeof setting.value === "object" && !Array.isArray(setting.value)
    ? setting.value
    : {};
}

function settingText(object: Record<string, Json | undefined>, key: string, fallback = ""): string {
  const value = object[key];
  return typeof value === "string" ? value : fallback;
}

function toLineText(value: string[]): string {
  return value.join("\n");
}

function toList(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Field({
  name,
  label,
  value,
  multiline = false,
  required = false,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  multiline?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`editor-${name}`}>{label}{required ? <span className="ml-1 text-destructive">*</span> : null}</Label>
      {multiline ? (
        <Textarea id={`editor-${name}`} value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <Input id={`editor-${name}`} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
      )}
    </div>
  );
}

function EditorFields({ editor, onChange }: { editor: EditorState; onChange: (key: string, value: string | boolean) => void }) {
  const value = (key: string) => String(editor.values[key] ?? "");
  const check = (key: string, label: string) => (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`editor-${key}`}
        checked={editor.values[key] === true}
        onCheckedChange={(checked) => onChange(key, checked === true)}
      />
      <Label htmlFor={`editor-${key}`}>{label}</Label>
    </div>
  );

  if (editor.kind === "project") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="title" label="Project title" value={value("title")} required onChange={(next) => onChange("title", next)} />
        <Field name="slug" label="Slug" value={value("slug")} required onChange={(next) => onChange("slug", next)} />
        <Field name="category" label="Category" value={value("category")} required onChange={(next) => onChange("category", next)} />
        <div className="space-y-2">
          <Label htmlFor="editor-status">Status</Label>
          <Select value={value("status")} onValueChange={(next) => onChange("status", next)}>
            <SelectTrigger id="editor-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Prototype">Prototype</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2"><Field name="description" label="Short description" value={value("description")} multiline onChange={(next) => onChange("description", next)} /></div>
        <div className="sm:col-span-2"><Field name="overview" label="Overview" value={value("overview")} multiline onChange={(next) => onChange("overview", next)} /></div>
        <Field name="problem" label="Problem addressed" value={value("problem")} multiline onChange={(next) => onChange("problem", next)} />
        <Field name="solution" label="Solution" value={value("solution")} multiline onChange={(next) => onChange("solution", next)} />
        <div className="sm:col-span-2"><Field name="contribution" label="My contribution" value={value("contribution")} multiline onChange={(next) => onChange("contribution", next)} /></div>
        <Field name="tech_stack" label="Technologies (one per line)" value={value("tech_stack")} multiline onChange={(next) => onChange("tech_stack", next)} />
        <Field name="screenshots" label="Screenshot addresses (one per line)" value={value("screenshots")} multiline onChange={(next) => onChange("screenshots", next)} />
        <Field name="live_url" label="Live preview address" value={value("live_url")} onChange={(next) => onChange("live_url", next)} />
        <Field name="github_url" label="GitHub address" value={value("github_url")} onChange={(next) => onChange("github_url", next)} />
        <Field name="sort_order" label="Display order" value={value("sort_order")} onChange={(next) => onChange("sort_order", next)} />
        <div className="flex items-center pt-7">{check("is_published", "Show this project publicly")}</div>
      </div>
    );
  }

  if (editor.kind === "service") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="title" label="Service title" value={value("title")} required onChange={(next) => onChange("title", next)} />
        <Field name="slug" label="Slug" value={value("slug")} required onChange={(next) => onChange("slug", next)} />
        <Field name="icon" label="Icon name" value={value("icon")} onChange={(next) => onChange("icon", next)} />
        <Field name="sort_order" label="Display order" value={value("sort_order")} onChange={(next) => onChange("sort_order", next)} />
        <div className="sm:col-span-2"><Field name="description" label="Description" value={value("description")} multiline onChange={(next) => onChange("description", next)} /></div>
        <div className="sm:col-span-2"><Field name="features" label="Features (one per line)" value={value("features")} multiline onChange={(next) => onChange("features", next)} /></div>
        <div className="flex items-center">{check("is_visible", "Show this service publicly")}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field name="period" label="Period" value={value("period")} onChange={(next) => onChange("period", next)} />
      <Field name="title" label="Milestone" value={value("title")} required onChange={(next) => onChange("title", next)} />
      <Field name="organization" label="Organization" value={value("organization")} onChange={(next) => onChange("organization", next)} />
      <Field name="sort_order" label="Display order" value={value("sort_order")} onChange={(next) => onChange("sort_order", next)} />
      <div className="sm:col-span-2"><Field name="description" label="Details" value={value("description")} multiline onChange={(next) => onChange("description", next)} /></div>
      <div className="flex items-center">{check("is_visible", "Show this milestone publicly")}</div>
    </div>
  );
}

function SectionHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminDashboard() {
  const { data } = useSuspenseQuery(adminDataQueryOptions);
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/admin" });
  const [activePanel, setActivePanel] = useState<Panel>("inquiries");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: EditorKind; id: string; title: string } | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshData = () => queryClient.invalidateQueries({ queryKey: adminDataQueryOptions.queryKey });
  const setFailure = (text: string) => setNotice({ kind: "error", text });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", replace: true });
  };

  const updateInquiry = async (inquiry: Inquiry, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", inquiry.id);
    if (error) {
      setFailure("That inquiry status could not be updated.");
      return;
    }
    setNotice({ kind: "success", text: "Inquiry status saved." });
    await refreshData();
  };

  const newEditor = (kind: EditorKind) => {
    const values: Record<string, string | boolean> = kind === "project"
      ? { title: "", slug: "", category: "Business Websites", description: "", overview: "", problem: "", solution: "", contribution: "", tech_stack: "", screenshots: "", live_url: "", github_url: "", status: "Prototype", is_published: false, sort_order: String(data.projects.length + 1) }
      : kind === "service"
        ? { title: "", slug: "", description: "", icon: "Globe2", features: "", is_visible: true, sort_order: String(data.services.length + 1) }
        : { period: "", title: "", organization: "", description: "", is_visible: false, sort_order: String(data.journey.length + 1) };
    setEditor({ kind, id: null, values });
    setNotice(null);
  };

  const editProject = (project: Project) => setEditor({
    kind: "project",
    id: project.id,
    values: {
      title: project.title, slug: project.slug, category: project.category, description: project.description,
      overview: project.overview, problem: project.problem, solution: project.solution, contribution: project.contribution,
      tech_stack: toLineText(project.tech_stack), screenshots: toLineText(arrayFromJson(project.screenshots)),
      live_url: project.live_url ?? "", github_url: project.github_url ?? "", status: project.status,
      is_published: project.is_published, sort_order: String(project.sort_order),
    },
  });

  const editService = (service: Service) => setEditor({
    kind: "service",
    id: service.id,
    values: {
      title: service.title, slug: service.slug, description: service.description, icon: service.icon,
      features: toLineText(arrayFromJson(service.features)), is_visible: service.is_visible, sort_order: String(service.sort_order),
    },
  });

  const editJourney = (entry: Journey) => setEditor({
    kind: "journey",
    id: entry.id,
    values: {
      period: entry.period, title: entry.title, organization: entry.organization ?? "", description: entry.description,
      is_visible: entry.is_visible, sort_order: String(entry.sort_order),
    },
  });

  const changeEditorValue = (key: string, value: string | boolean) => {
    setEditor((current) => current ? { ...current, values: { ...current.values, [key]: value } } : current);
  };

  const handleEditorSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    setSaving(true);
    setNotice(null);
    try {
      const value = editor.values;
      let error: { message: string } | null = null;
      if (editor.kind === "project") {
        const parsed = projectAdminSchema.safeParse({
          title: String(value["title"] ?? ""), slug: String(value["slug"] ?? ""), category: String(value["category"] ?? ""),
          description: String(value["description"] ?? ""), overview: String(value["overview"] ?? ""), problem: String(value["problem"] ?? ""),
          solution: String(value["solution"] ?? ""), contribution: String(value["contribution"] ?? ""), tech_stack: toList(String(value["tech_stack"] ?? "")),
          screenshots: toList(String(value["screenshots"] ?? "")), live_url: String(value["live_url"] ?? ""), github_url: String(value["github_url"] ?? ""),
          status: String(value["status"] ?? "Prototype"), is_published: value["is_published"] === true, sort_order: Number(value["sort_order"] ?? 0),
        });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the project details.");
        const payload = { ...parsed.data, screenshots: parsed.data.screenshots, updated_at: new Date().toISOString() };
        const result = editor.id
          ? await supabase.from("projects").update(payload).eq("id", editor.id)
          : await supabase.from("projects").insert(payload);
        error = result.error;
      } else if (editor.kind === "service") {
        const parsed = serviceAdminSchema.safeParse({
          title: String(value["title"] ?? ""), slug: String(value["slug"] ?? ""), description: String(value["description"] ?? ""),
          icon: String(value["icon"] ?? "Globe2"), features: toList(String(value["features"] ?? "")),
          is_visible: value["is_visible"] === true, sort_order: Number(value["sort_order"] ?? 0),
        });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the service details.");
        const result = editor.id
          ? await supabase.from("services").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", editor.id)
          : await supabase.from("services").insert(parsed.data);
        error = result.error;
      } else {
        const parsed = journeyAdminSchema.safeParse({
          period: String(value["period"] ?? ""), title: String(value["title"] ?? ""), organization: String(value["organization"] ?? ""),
          description: String(value["description"] ?? ""), is_visible: value["is_visible"] === true, sort_order: Number(value["sort_order"] ?? 0),
        });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the milestone details.");
        const payload = { ...parsed.data, organization: parsed.data.organization || null };
        const result = editor.id
          ? await supabase.from("journey").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editor.id)
          : await supabase.from("journey").insert(payload);
        error = result.error;
      }
      if (error) throw new Error("Your changes could not be saved. Check for a duplicate slug or try again.");
      setEditor(null);
      setNotice({ kind: "success", text: "Your changes have been saved." });
      await refreshData();
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Your changes could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const { kind, id } = deleteTarget;
    const result = kind === "project"
      ? await supabase.from("projects").delete().eq("id", id)
      : kind === "service"
        ? await supabase.from("services").delete().eq("id", id)
        : await supabase.from("journey").delete().eq("id", id);
    if (result.error) {
      setFailure("This item could not be removed.");
    } else {
      setNotice({ kind: "success", text: "The item has been removed." });
      setEditor(null);
      await refreshData();
    }
    setDeleteTarget(null);
    setSaving(false);
  };

  const handleSettingsSave = async (event: FormEvent<HTMLFormElement>, key: string) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setNotice(null);
    let value: Record<string, Json>;
    if (key === "profile") {
      value = {
        name: String(form.get("name") ?? "").trim(), title: String(form.get("title") ?? "").trim(),
        tagline: String(form.get("tagline") ?? "").trim(), bio: String(form.get("bio") ?? "").trim(),
        profile_image_url: String(form.get("profile_image_url") ?? "").trim(), education: String(form.get("education") ?? "").trim(),
        interests: String(form.get("interests") ?? "").trim(), approach: String(form.get("approach") ?? "").trim(),
      };
    } else if (key === "contact") {
      value = {
        email: String(form.get("email") ?? "").trim(), whatsapp_url: String(form.get("whatsapp_url") ?? "").trim(),
        linkedin_url: String(form.get("linkedin_url") ?? "").trim(), github_url: String(form.get("github_url") ?? "").trim(),
        resume_url: String(form.get("resume_url") ?? "").trim(),
      };
    } else {
      value = {
        enabled: form.get("enabled") === "on",
        status_text: String(form.get("status_text") ?? "").trim(),
      };
    }
    const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    if (error) {
      setFailure("These settings could not be saved. Check the entries and try again.");
    } else {
      setNotice({ kind: "success", text: "Site settings saved." });
      await refreshData();
    }
    setSaving(false);
  };

  const profile = settingObject(data.settings.find((setting) => setting.key === "profile"));
  const contact = settingObject(data.settings.find((setting) => setting.key === "contact"));
  const availability = settingObject(data.settings.find((setting) => setting.key === "availability"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <a href="/" className="text-sm font-bold uppercase text-foreground">GHARSHAN<span className="text-primary">.</span><span className="ml-3 border-l border-border pl-3 text-xs font-medium text-muted-foreground">Admin</span></a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">gharshankv123@gmail.com</span>
            <Button variant="outline" size="sm" onClick={() => void handleSignOut()}><LogOut aria-hidden="true" /> Sign out</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-12">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 hidden text-xs font-semibold uppercase text-muted-foreground lg:block">Workspace</p>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1" aria-label="Admin sections">
            {panels.map(({ id, label, icon: Icon }) => (
              <Button key={id} variant={activePanel === id ? "secondary" : "ghost"} className="shrink-0 justify-start" onClick={() => { setActivePanel(id); setNotice(null); }}>
                <Icon aria-hidden="true" /> {label}
              </Button>
            ))}
          </nav>
          <a href="/" className="mt-6 hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:flex">View public portfolio <ExternalLink className="size-4" aria-hidden="true" /></a>
        </aside>

        <main className="min-w-0">
          <div className="mb-8 border-b border-border pb-6">
            <p className="text-xs font-semibold uppercase text-primary">Private workspace</p>
            <h1 className="mt-2 text-3xl font-semibold">Portfolio management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Review new project inquiries and maintain the public portfolio.</p>
          </div>

          {notice ? <div role={notice.kind === "error" ? "alert" : "status"} className={`mb-6 border-l-2 px-4 py-3 text-sm ${notice.kind === "error" ? "border-destructive text-destructive" : "border-primary text-foreground"}`}>{notice.text}</div> : null}

          {activePanel === "inquiries" ? (
            <section>
              <SectionHeading title="Client inquiries" description={`${data.inquiries.length} total · newest first`} />
              {data.inquiries.length ? (
                <div className="divide-y divide-border">
                  {data.inquiries.map((inquiry) => (
                    <article key={inquiry.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_160px_auto] sm:items-center">
                      <button type="button" className="min-w-0 text-left" onClick={() => setSelectedInquiry(inquiry)}>
                        <span className="block truncate font-semibold text-foreground">{inquiry.full_name}</span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">{inquiry.email}{inquiry.business_name ? ` · ${inquiry.business_name}` : ""}</span>
                        <span className="mt-2 block text-xs text-muted-foreground">{dateLabel(inquiry.created_at)}{inquiry.service_needed ? ` · ${inquiry.service_needed}` : ""}</span>
                      </button>
                      <Select value={inquiry.status} onValueChange={(value) => void updateInquiry(inquiry, value)}>
                        <SelectTrigger aria-label={`Status for ${inquiry.full_name}`}><SelectValue /></SelectTrigger>
                        <SelectContent>{inquiryStatuses.map((status) => <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(inquiry)}>View details <Pencil aria-hidden="true" /></Button>
                    </article>
                  ))}
                </div>
              ) : <p className="py-10 text-sm text-muted-foreground">No inquiries have arrived yet.</p>}
            </section>
          ) : null}

          {activePanel === "projects" ? (
            <section>
              <SectionHeading title="Projects" description="Edit draft work or publish verified projects." action={<Button onClick={() => newEditor("project")}><Plus aria-hidden="true" /> Add project</Button>} />
              {data.projects.length ? <div className="divide-y divide-border">
                {data.projects.map((project) => <article key={project.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h3 className="font-semibold">{project.title}</h3><p className="mt-1 text-sm text-muted-foreground">{project.category} · {project.status} · {project.is_published ? "Published" : "Draft"}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p></div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => editProject(project)}><Pencil aria-hidden="true" /> Edit</Button>
                </article>)}
              </div> : <p className="py-10 text-sm text-muted-foreground">No projects yet.</p>}
            </section>
          ) : null}

          {activePanel === "services" ? (
            <section>
              <SectionHeading title="Services" description="Choose which services appear on the public portfolio." action={<Button onClick={() => newEditor("service")}><Plus aria-hidden="true" /> Add service</Button>} />
              {data.services.length ? <div className="divide-y divide-border">
                {data.services.map((service) => <article key={service.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h3 className="font-semibold">{service.title}</h3><p className="mt-1 text-sm text-muted-foreground">{service.is_visible ? "Visible publicly" : "Hidden"}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{service.description}</p></div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => editService(service)}><Pencil aria-hidden="true" /> Edit</Button>
                </article>)}
              </div> : <p className="py-10 text-sm text-muted-foreground">No services yet.</p>}
            </section>
          ) : null}

          {activePanel === "journey" ? (
            <section>
              <SectionHeading title="Journey" description="Manage timeline entries shown on the public portfolio." action={<Button onClick={() => newEditor("journey")}><Plus aria-hidden="true" /> Add milestone</Button>} />
              {data.journey.length ? <div className="divide-y divide-border">
                {data.journey.map((entry) => <article key={entry.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><p className="text-xs font-medium text-primary">{entry.period || "Period not set"}</p><h3 className="mt-1 font-semibold">{entry.title}</h3><p className="mt-1 text-sm text-muted-foreground">{entry.organization || "Organization not set"} · {entry.is_visible ? "Visible publicly" : "Hidden"}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.description}</p></div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => editJourney(entry)}><Pencil aria-hidden="true" /> Edit</Button>
                </article>)}
              </div> : <p className="py-10 text-sm text-muted-foreground">No timeline entries yet.</p>}
            </section>
          ) : null}

          {activePanel === "settings" ? (
            <section className="space-y-10">
              <SectionHeading title="Site settings" description="Update the details shown across the public portfolio." />
              <section className="border-b border-border pb-8">
                <h3 className="text-lg font-semibold">Profile</h3>
                <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void handleSettingsSave(event, "profile")}>
                  <div className="space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" name="name" defaultValue={settingText(profile, "name", defaultPortfolioData.profile.name)} required maxLength={120} /></div>
                  <div className="space-y-2"><Label htmlFor="profile-title">Title</Label><Input id="profile-title" name="title" defaultValue={settingText(profile, "title", defaultPortfolioData.profile.title)} required maxLength={120} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="profile-tagline">Tagline</Label><Input id="profile-tagline" name="tagline" defaultValue={settingText(profile, "tagline", defaultPortfolioData.profile.tagline)} maxLength={200} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="profile-bio">About</Label><Textarea id="profile-bio" name="bio" defaultValue={settingText(profile, "bio", defaultPortfolioData.profile.bio)} rows={5} maxLength={4000} /></div>
                  <div className="space-y-2"><Label htmlFor="profile-image">Profile image address</Label><Input id="profile-image" name="profile_image_url" type="url" defaultValue={settingText(profile, "profile_image_url")} /></div>
                  <div className="space-y-2"><Label htmlFor="profile-education">Education</Label><Input id="profile-education" name="education" defaultValue={settingText(profile, "education", defaultPortfolioData.profile.education)} maxLength={300} /></div>
                  <div className="space-y-2"><Label htmlFor="profile-interests">Areas of interest</Label><Input id="profile-interests" name="interests" defaultValue={settingText(profile, "interests", defaultPortfolioData.profile.interests)} maxLength={500} /></div>
                  <div className="space-y-2"><Label htmlFor="profile-approach">Professional approach</Label><Input id="profile-approach" name="approach" defaultValue={settingText(profile, "approach", defaultPortfolioData.profile.approach)} maxLength={500} /></div>
                  <div className="sm:col-span-2"><Button type="submit" disabled={saving}><Check aria-hidden="true" /> Save profile</Button></div>
                </form>
              </section>
              <section className="border-b border-border pb-8">
                <h3 className="text-lg font-semibold">Contact links</h3>
                <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void handleSettingsSave(event, "contact")}>
                  <div className="space-y-2"><Label htmlFor="contact-email">Email address</Label><Input id="contact-email" name="email" type="email" defaultValue={settingText(contact, "email")} maxLength={255} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-whatsapp">WhatsApp link</Label><Input id="contact-whatsapp" name="whatsapp_url" type="url" defaultValue={settingText(contact, "whatsapp_url")} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-linkedin">LinkedIn link</Label><Input id="contact-linkedin" name="linkedin_url" type="url" defaultValue={settingText(contact, "linkedin_url")} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-github">GitHub link</Label><Input id="contact-github" name="github_url" type="url" defaultValue={settingText(contact, "github_url")} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-resume">Resume link</Label><Input id="contact-resume" name="resume_url" type="url" defaultValue={settingText(contact, "resume_url")} /></div>
                  <div className="sm:col-span-2"><Button type="submit" disabled={saving}><Check aria-hidden="true" /> Save contact links</Button></div>
                </form>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Availability</h3>
                <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void handleSettingsSave(event, "availability")}>
                  <div className="space-y-2"><Label htmlFor="availability-status">Status text</Label><Input id="availability-status" name="status_text" defaultValue={settingText(availability, "status_text", "Availability not set")} maxLength={120} /></div>
                  <div className="flex items-center gap-2 sm:pt-7"><Checkbox id="availability-enabled" name="enabled" defaultChecked={availability["enabled"] === true} /><Label htmlFor="availability-enabled">Show as available</Label></div>
                  <div className="sm:col-span-2"><Button type="submit" disabled={saving}><Check aria-hidden="true" /> Save availability</Button></div>
                </form>
              </section>
            </section>
          ) : null}
        </main>
      </div>

      <Dialog open={selectedInquiry !== null} onOpenChange={(open) => { if (!open) setSelectedInquiry(null); }}>
        {selectedInquiry ? <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>Inquiry from {selectedInquiry.full_name}</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2"><p><span className="block text-xs font-medium uppercase text-muted-foreground">Email</span><a className="mt-1 inline-block text-primary" href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a></p><p><span className="block text-xs font-medium uppercase text-muted-foreground">Received</span><span className="mt-1 inline-block">{dateLabel(selectedInquiry.created_at)}</span></p></div>
            {selectedInquiry.business_name ? <p><span className="block text-xs font-medium uppercase text-muted-foreground">Business</span><span className="mt-1 inline-block">{selectedInquiry.business_name}</span></p> : null}
            <div className="grid gap-3 sm:grid-cols-2"><p><span className="block text-xs font-medium uppercase text-muted-foreground">Service</span><span className="mt-1 inline-block">{selectedInquiry.service_needed || "Not specified"}</span></p><p><span className="block text-xs font-medium uppercase text-muted-foreground">Budget</span><span className="mt-1 inline-block">{selectedInquiry.budget_range || "Not specified"}</span></p></div>
            <p><span className="block text-xs font-medium uppercase text-muted-foreground">Timeline</span><span className="mt-1 inline-block">{selectedInquiry.timeline || "Not specified"}</span></p>
            <div><span className="block text-xs font-medium uppercase text-muted-foreground">Project description</span><p className="mt-2 whitespace-pre-wrap leading-6">{selectedInquiry.message}</p></div>
            <div className="space-y-2"><Label htmlFor="inquiry-detail-status">Status</Label><Select value={selectedInquiry.status} onValueChange={(value) => { void updateInquiry(selectedInquiry, value); setSelectedInquiry({ ...selectedInquiry, status: value }); }}><SelectTrigger id="inquiry-detail-status"><SelectValue /></SelectTrigger><SelectContent>{inquiryStatuses.map((status) => <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </DialogContent> : null}
      </Dialog>

      <Dialog open={editor !== null} onOpenChange={(open) => { if (!open) setEditor(null); }}>
        {editor ? <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>{editor.id ? "Edit" : "Add"} {editor.kind === "project" ? "project" : editor.kind === "service" ? "service" : "journey milestone"}</DialogTitle></DialogHeader>
          <form onSubmit={(event) => void handleEditorSave(event)} className="space-y-6">
            <EditorFields editor={editor} onChange={changeEditorValue} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              {editor.id ? <Button type="button" variant="destructive" onClick={() => setDeleteTarget({ kind: editor.kind, id: editor.id ?? "", title: String(editor.values["title"] ?? "this item") })}><Trash2 aria-hidden="true" /> Delete</Button> : <span />}
              <div className="ml-auto flex gap-2"><Button type="button" variant="outline" onClick={() => setEditor(null)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></div>
            </div>
          </form>
        </DialogContent> : null}
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this item?</AlertDialogTitle><AlertDialogDescription>“{deleteTarget?.title}” will be permanently removed from the portfolio.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void handleDelete(); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}