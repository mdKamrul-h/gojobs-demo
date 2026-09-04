import type {
  ApplicationStage,
  CompanySize,
  Industry,
  Job,
  JobStatus,
  Location,
  TrustStatus,
} from "@/lib/types";
import { jobs as fixtureJobs } from "../fixtures/jobs";
import { getApplicantCountByJobId } from "./applications";
import { mockDelay } from "../delay";

const ONBOARDING_KEY = "gojobs_employer_onboarding";
const JOBS_KEY = "gojobs_employer_jobs";

export interface EmployerOnboardingData {
  companyName: string;
  industry: Industry;
  size: CompanySize;
  location: Location;
  website?: string;
  description: string;
  trustStatus: TrustStatus;
  submittedAt?: string;
}

export type JobDraft = Omit<Job, "id" | "slug" | "postedAt" | "applicantCount"> & {
  id?: string;
  slug?: string;
  postedAt?: string;
  applicantCount?: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function getStoredOnboarding(): EmployerOnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    return stored ? (JSON.parse(stored) as EmployerOnboardingData) : null;
  } catch {
    return null;
  }
}

function getStoredJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(JOBS_KEY);
    return stored ? (JSON.parse(stored) as Job[]) : [];
  } catch {
    return [];
  }
}

function persistJobs(storedJobs: Job[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(storedJobs));
  } catch {
    // ignore
  }
}

export async function getEmployerOnboarding(): Promise<EmployerOnboardingData | null> {
  await mockDelay();
  return getStoredOnboarding();
}

export async function saveEmployerOnboarding(
  data: Omit<EmployerOnboardingData, "trustStatus" | "submittedAt">
): Promise<EmployerOnboardingData> {
  await mockDelay(200, 400);
  const saved: EmployerOnboardingData = {
    ...data,
    trustStatus: "pending",
    submittedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(saved));
  }
  return saved;
}

export async function approveEmployerTrust(): Promise<EmployerOnboardingData | null> {
  await mockDelay(300, 500);
  const current = getStoredOnboarding();
  if (!current) return null;
  const updated = { ...current, trustStatus: "approved" as TrustStatus };
  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
  }
  return updated;
}

function enrichJobWithApplicantCount(job: Job): Job {
  return {
    ...job,
    applicantCount: getApplicantCountByJobId(job.id),
  };
}

export async function getEmployerJobs(companyId: string): Promise<Job[]> {
  await mockDelay();
  const stored = getStoredJobs().filter((j) => j.companyId === companyId);
  const fixture = fixtureJobs.filter((j) => j.companyId === companyId);
  const storedIds = new Set(stored.map((j) => j.id));
  const merged = [
    ...fixture.filter((j) => !storedIds.has(j.id)),
    ...stored,
  ];
  return merged
    .sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    )
    .map(enrichJobWithApplicantCount);
}

export async function getEmployerJobById(id: string): Promise<Job | undefined> {
  await mockDelay();
  const stored = getStoredJobs().find((j) => j.id === id);
  const job = stored ?? fixtureJobs.find((j) => j.id === id);
  return job ? enrichJobWithApplicantCount(job) : undefined;
}

export async function saveJobDraft(
  companyId: string,
  draft: JobDraft,
  existingId?: string
): Promise<Job> {
  await mockDelay(200, 400);
  const stored = getStoredJobs();
  const now = new Date().toISOString();
  const id = existingId ?? draft.id ?? `job-${Date.now()}`;
  const title = draft.title || "Untitled Job";
  const job: Job = {
    ...draft,
    id,
    slug: draft.slug ?? slugify(`${title}-${id.slice(-4)}`),
    companyId,
    status: "draft",
    postedAt: draft.postedAt ?? now,
    applicantCount: draft.applicantCount ?? 0,
    title,
  };
  const filtered = stored.filter((j) => j.id !== id);
  persistJobs([...filtered, job]);
  return job;
}

export async function publishJob(jobId: string): Promise<Job | undefined> {
  await mockDelay(200, 400);
  const stored = getStoredJobs();
  const idx = stored.findIndex((j) => j.id === jobId);
  if (idx >= 0) {
    const updated = { ...stored[idx], status: "published" as JobStatus };
    const next = [...stored];
    next[idx] = updated;
    persistJobs(next);
    return updated;
  }
  const fixture = fixtureJobs.find((j) => j.id === jobId);
  if (fixture) {
    const published = { ...fixture, status: "published" as JobStatus };
    persistJobs([...stored, published]);
    return published;
  }
  return undefined;
}

export const APPLICATION_STAGES: ApplicationStage[] = [
  "applied",
  "reviewed",
  "screening",
  "general_assessment",
  "ai_interview",
  "human_interview",
  "employer_checks",
  "offer",
  "hired",
];

export function getStageIndex(stage: ApplicationStage): number {
  return APPLICATION_STAGES.indexOf(stage);
}
