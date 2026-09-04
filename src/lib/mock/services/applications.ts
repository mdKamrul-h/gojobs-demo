import type { Application, ApplicationStage, GuestInfo } from "@/lib/types";
import {
  applications,
  getApplicationById,
  getApplicationsByCandidateId,
  getApplicationsByJobId,
} from "../fixtures/applications";
import { mockDelay } from "../delay";

const STORAGE_KEY = "gojobs_applications";

function getPersistedApplications(): Application[] {
  if (typeof window === "undefined") return applications;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Application[];
      const overrideMap = new Map(parsed.map((a) => [a.id, a]));
      const fixtureIds = new Set(applications.map((a) => a.id));
      const merged = applications.map((app) => {
        const override = overrideMap.get(app.id);
        return override ? { ...app, ...override } : app;
      });
      const newApps = parsed.filter((a) => !fixtureIds.has(a.id));
      return [...merged, ...newApps];
    }
  } catch {
    // ignore parse errors
  }
  return applications;
}

function persistApplication(app: Application): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: Application[] = stored ? JSON.parse(stored) : [];
    const filtered = existing.filter((a) => a.id !== app.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, app]));
  } catch {
    // ignore storage errors
  }
}

export async function getApplications(): Promise<Application[]> {
  await mockDelay();
  return getPersistedApplications();
}

export async function getApplicationByIdAsync(
  id: string
): Promise<Application | undefined> {
  await mockDelay();
  return getPersistedApplications().find((a) => a.id === id) ?? getApplicationById(id);
}

export async function getApplicationsByJobIdAsync(
  jobId: string
): Promise<Application[]> {
  await mockDelay();
  return getPersistedApplications().filter((a) => a.jobId === jobId);
}

export async function getApplicationsByCandidateIdAsync(
  candidateId: string
): Promise<Application[]> {
  await mockDelay();
  const all = getPersistedApplications();
  return all.filter((a) => a.candidateId === candidateId);
}

export async function submitGuestApplication(data: {
  jobId: string;
  guestInfo: GuestInfo;
  screeningAnswers: { questionId: string; answer: string }[];
}): Promise<Application> {
  await mockDelay(300, 500);
  const app: Application = {
    id: `app-guest-${Date.now()}`,
    jobId: data.jobId,
    guestInfo: data.guestInfo,
    stage: "applied",
    matchScore: 0,
    matchDimensions: [],
    screeningAnswers: data.screeningAnswers,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  persistApplication(app);
  return app;
}

export async function updateApplicationStage(
  applicationId: string,
  stage: ApplicationStage
): Promise<Application | undefined> {
  await mockDelay();
  const all = getPersistedApplications();
  const app = all.find((a) => a.id === applicationId);
  if (!app) return undefined;
  const updated = { ...app, stage, updatedAt: new Date().toISOString() };
  persistApplication(updated);
  return updated;
}

export async function addApplicationNote(
  applicationId: string,
  note: string
): Promise<Application | undefined> {
  await mockDelay();
  const all = getPersistedApplications();
  const app = all.find((a) => a.id === applicationId);
  if (!app) return undefined;
  const recruiterNote = {
    id: `note-${Date.now()}`,
    text: note,
    createdAt: new Date().toISOString(),
    author: "Recruiter",
  };
  const updated = {
    ...app,
    notes: [...(app.notes ?? []), note],
    recruiterNotes: [...(app.recruiterNotes ?? []), recruiterNote],
    activityLog: [
      ...(app.activityLog ?? []),
      {
        id: `activity-${Date.now()}`,
        type: "note_added" as const,
        label: note,
        timestamp: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };
  persistApplication(updated);
  return updated;
}

export { applications, getApplicationsByJobId, getApplicationsByCandidateId };

export function getApplicantCountByJobId(jobId: string): number {
  return getPersistedApplications().filter(
    (a) => a.jobId === jobId && a.stage !== "rejected"
  ).length;
}
