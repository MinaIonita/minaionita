"use client";

/**
 * Minimal admin API client. The JWT lives in localStorage — fine for a
 * single-admin dev panel; for production the admin should move to its own
 * subdomain with httpOnly cookies (brief §7).
 */
const API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const TOKEN_KEY = "mi_admin_token";

export const auth = {
  get token() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (auth.token) headers.set("Authorization", `Bearer ${auth.token}`);

  const res = await fetch(`${API}${path}`, { ...init, headers });

  if (res.status === 401) {
    auth.clear();
    throw new ApiError(401, "Sesiune expirată");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(res.status, body.message ?? `Eroare ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type LoginResult =
  | { token: string; user: AdminUser }
  | { twoFactorRequired: true };

export const api = {
  login: (email: string, password: string, code?: string) =>
    request<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, ...(code ? { code } : {}) }),
    }),
  me: () => request<AdminUser & { twoFactorEnabled: boolean }>("/auth/me"),
  start2fa: () => request<{ qr: string; uri: string }>("/auth/2fa/start", { method: "POST" }),
  confirm2fa: (code: string) =>
    request<{ enabled: boolean }>("/auth/2fa/confirm", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  disable2fa: (code: string) =>
    request<{ enabled: boolean }>("/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  leads: (status?: string) =>
    request<Lead[]>(`/leads${status ? `?status=${status}` : ""}`),
  lead: (id: string) => request<Lead>(`/leads/${id}`),
  setLeadStatus: (id: string, status: string) =>
    request<Lead>(`/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  replyLead: (id: string, body: string) =>
    request<{ sent: boolean }>(`/leads/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
  convertLead: (id: string) =>
    request<{ projectId: string; already: boolean }>(`/leads/${id}/convert`, {
      method: "POST",
    }),

  // ── Content: services ──
  services: () => request<ServiceRow[]>("/admin/content/services"),
  service: (id: string) => request<ServiceRow>(`/admin/content/services/${id}`),
  updateService: (id: string, data: Partial<ServiceRow>) =>
    request<ServiceRow>(`/admin/content/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // ── Content: portfolio ──
  portfolio: () => request<PortfolioRow[]>("/admin/content/portfolio"),
  portfolioItem: (id: string) => request<PortfolioRow>(`/admin/content/portfolio/${id}`),
  updatePortfolio: (id: string, data: Partial<PortfolioRow>) =>
    request<PortfolioRow>(`/admin/content/portfolio/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // ── Content: testimonials ──
  testimonials: () => request<Testimonial[]>("/admin/content/testimonials"),
  createTestimonial: (data: Partial<Testimonial>) =>
    request<Testimonial>("/admin/content/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    request<Testimonial>(`/admin/content/testimonials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    request<void>(`/admin/content/testimonials/${id}`, { method: "DELETE" }),

  // ── Client projects + credential vault (§5) ──
  projects: () => request<ProjectRow[]>("/admin/projects"),
  project: (id: string) => request<ProjectFull>(`/admin/projects/${id}`),
  createProject: (data: Partial<ProjectRow>) =>
    request<ProjectRow>("/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<ProjectRow>) =>
    request<ProjectRow>(`/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request<void>(`/admin/projects/${id}`, { method: "DELETE" }),
  addCredential: (projectId: string, data: CredentialInput) =>
    request<{ id: string }>(`/admin/projects/${projectId}/credentials`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCredential: (id: string, data: CredentialInput) =>
    request<{ id: string }>(`/admin/credentials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteCredential: (id: string) =>
    request<void>(`/admin/credentials/${id}`, { method: "DELETE" }),
  revealCredential: (id: string) =>
    request<{ password: string }>(`/admin/credentials/${id}/reveal`, { method: "POST" }),

  // ── Contracts + ANAF (§5bis) ──
  contractTemplates: () => request<{ key: string; label: string }[]>("/admin/contracts/templates"),
  anafLookup: (cui: string) =>
    request<AnafResult>(`/admin/contracts/anaf?cui=${encodeURIComponent(cui)}`),
  contracts: () => request<ContractRow[]>("/admin/contracts"),
  contract: (id: string) => request<ContractRow>(`/admin/contracts/${id}`),
  createContract: (data: Partial<ContractRow>) =>
    request<ContractRow>("/admin/contracts", { method: "POST", body: JSON.stringify(data) }),
  deleteContract: (id: string) =>
    request<void>(`/admin/contracts/${id}`, { method: "DELETE" }),

  // ── Monitoring (§5quater.2) ──
  monitoringStatus: () => request<SiteStatus[]>("/admin/monitoring/status"),
  monitoringExpiring: () => request<ExpiringItem[]>("/admin/monitoring/expiring"),
  refreshSsl: (projectId: string) =>
    request<{ sslExpiresAt: string | null }>(`/admin/monitoring/${projectId}/ssl`, {
      method: "POST",
    }),

  // ── Settings ──
  // /settings is the public, whitelisted subset; the admin screen needs the full
  // table, which is behind auth at /settings/all.
  settings: () => request<Record<string, unknown>>("/settings/all"),
  setSetting: (key: string, value: unknown) =>
    request<unknown>(`/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  budget?: string | null;
  status: string;
  utmSource?: string | null;
  landingPage?: string | null;
  referrer?: string | null;
  createdAt: string;
  clientProjectId?: string | null;
  service?: { title: string } | null;
  messages?: { direction: string; body: string; createdAt: string }[];
};

export const REPLY_TEMPLATES: { label: string; body: string }[] = [
  {
    label: "Programare call",
    body: "Salut! Mulțumesc pentru mesaj. Hai să vorbim 15–20 de minute despre proiect — îmi spui, te rog, când ți-e mai comod în zilele următoare? Aici e și numărul meu de WhatsApp dacă preferi mai rapid.",
  },
  {
    label: "Trimit ofertă",
    body: "Salut! Mulțumesc pentru interes. Pe baza a ce mi-ai scris, îți pregătesc o ofertă cu ce include, termen și un buget orientativ, și ți-o trimit în maximum 24 de ore. Dacă mai ai detalii utile, dă-mi de veste.",
  },
  {
    label: "Refuz politicos",
    body: "Salut și mulțumesc că te-ai gândit la mine. Din păcate, proiectul nu se potrivește acum cu ce pot prelua, dar aș fi bucuros să ținem legătura pentru viitor. Îți doresc mult succes cu el!",
  },
];

export type ServiceBody = {
  icon?: string;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  lead?: string;
  problem?: string;
  includes?: string[];
  process?: { title: string; body: string }[];
  faqs?: { q: string; a: string }[];
  relatedCategories?: string[];
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: ServiceBody;
  featured: boolean;
  order: number;
  status: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string | null;
  featured: boolean;
  order: number;
};

export type PortfolioBody = {
  icon?: string;
  tagline?: string;
  year?: number;
  description?: string;
};

export type PortfolioRow = {
  id: string;
  slug: string;
  client: string;
  category: string;
  liveUrl: string | null;
  tech: string[] | null;
  body: PortfolioBody;
  featured: boolean;
  order: number;
  status: string;
};

export const CONTENT_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export const CONTENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Ciornă",
  IN_REVIEW: "În revizuire",
  SCHEDULED: "Programat",
  PUBLISHED: "Publicat",
  ARCHIVED: "Arhivat",
};

export type AnafResult = {
  cui: string;
  name: string;
  address: string;
  regCom: string | null;
  caen: string | null;
  vatPayer: boolean;
  inactive: boolean;
  risk: string | null;
};

export type ContractRow = {
  id: string;
  number?: string;
  serviceTemplate: string;
  partyType: "INDIVIDUAL" | "COMPANY";
  partyName: string;
  partyCui?: string | null;
  partyRegCom?: string | null;
  partyAddress?: string | null;
  partyRepresentative?: string | null;
  partyVatPayer?: boolean | null;
  partyFiscallyInactive?: boolean | null;
  amount: number | string;
  currency: string;
  advancePct?: number | null;
  paymentTermDays?: number | null;
  penaltyPct?: number | string | null;
  deliveryTerm?: string | null;
  createdAt?: string;
  project?: { clientName: string } | null;
};

export type SiteStatus = {
  projectId: string;
  clientName: string;
  siteUrl: string | null;
  up: boolean | null;
  statusCode: number | null;
  responseMs: number | null;
  sslDaysLeft: number | null;
  domainDaysLeft: number | null;
  hostingDaysLeft: number | null;
  openIncidents: number;
};

export type ExpiringItem = {
  projectId: string;
  clientName: string;
  down: boolean;
  domainDaysLeft: number | null;
  hostingDaysLeft: number | null;
  sslDaysLeft: number | null;
};

export const PROJECT_STAGES = [
  "QUOTED",
  "IN_PROGRESS",
  "LIVE",
  "MAINTENANCE",
  "CLOSED",
] as const;

export const STAGE_LABELS: Record<string, string> = {
  QUOTED: "Ofertat",
  IN_PROGRESS: "În lucru",
  LIVE: "Live",
  MAINTENANCE: "Mentenanță",
  CLOSED: "Închis",
};

export type CredentialInput = {
  label: string;
  username?: string;
  password?: string;
  loginUrl?: string;
  note?: string;
};

export type MaskedCredential = {
  id: string;
  label: string;
  username?: string | null;
  loginUrl?: string | null;
  note?: string | null;
};

export type ProjectRow = {
  id: string;
  clientName: string;
  companyName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  domain?: string | null;
  registrar?: string | null;
  domainExpiresAt?: string | null;
  hostingProvider?: string | null;
  hostingPlan?: string | null;
  hostingExpiresAt?: string | null;
  sslExpiresAt?: string | null;
  siteUrl?: string | null;
  adminUrl?: string | null;
  stage: string;
  contractValue?: string | number | null;
  currency?: string | null;
  notes?: string | null;
  updatedAt?: string;
  _count?: { credentials: number };
};

export type ProjectFull = ProjectRow & { credentials: MaskedCredential[] };

export const TICKET_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "REPLIED",
  "QUOTED",
  "WON",
  "LOST",
  "CLOSED",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEW: "Nou",
  IN_PROGRESS: "În lucru",
  REPLIED: "Răspuns trimis",
  QUOTED: "Ofertat",
  WON: "Câștigat",
  LOST: "Pierdut",
  CLOSED: "Închis",
};
