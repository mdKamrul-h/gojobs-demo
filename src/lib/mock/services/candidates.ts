import type { Candidate, CareerPassport } from "@/lib/types";
import {
  candidates as fixtureCandidates,
  getCandidateById,
  getCandidateByUserId,
} from "../fixtures/candidates";
import { jobs } from "../fixtures/jobs";
import { getMatchExplanation } from "./match";
import { mockDelay } from "../delay";

const STORAGE_KEY = "gojobs_candidates";

function getPersistedOverrides(): Record<string, Partial<Candidate>> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, Partial<Candidate>>) : {};
  } catch {
    return {};
  }
}

function persistOverride(candidateId: string, data: Partial<Candidate>): void {
  if (typeof window === "undefined") return;
  try {
    const overrides = getPersistedOverrides();
    overrides[candidateId] = { ...overrides[candidateId], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore storage errors
  }
}

function mergeCandidate(base: Candidate): Candidate {
  const overrides = getPersistedOverrides()[base.id];
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    passport: overrides.passport
      ? { ...base.passport, ...overrides.passport }
      : base.passport,
    savedJobIds: overrides.savedJobIds ?? base.savedJobIds,
  };
}

export function computePassportCompleteness(passport: CareerPassport): number {
  let score = 0;
  if (passport.headline?.trim()) score += 8;
  if (passport.summary?.trim()) score += 12;
  if (passport.phone?.trim()) score += 5;
  if (passport.email?.trim()) score += 5;
  if (passport.experience.length > 0) score += 25;
  if (passport.education.length > 0) score += 15;
  if (passport.skills.length >= 3) score += 20;
  else if (passport.skills.length > 0) score += 10;
  if (passport.preferences.desiredRoles.length > 0) score += 5;
  if (passport.preferences.salaryExpectation.min > 0) score += 5;
  return Math.min(100, score);
}

function getAllCandidates(): Candidate[] {
  return fixtureCandidates.map(mergeCandidate);
}

export async function getCandidates(): Promise<Candidate[]> {
  await mockDelay();
  return getAllCandidates();
}

export async function getCandidateByIdAsync(id: string): Promise<Candidate | undefined> {
  await mockDelay();
  const base = getCandidateById(id);
  return base ? mergeCandidate(base) : undefined;
}

export async function getCandidateByUserIdAsync(
  userId: string
): Promise<Candidate | undefined> {
  await mockDelay();
  const base = getCandidateByUserId(userId);
  return base ? mergeCandidate(base) : undefined;
}

export async function updateCandidatePassport(
  candidateId: string,
  passport: CareerPassport
): Promise<Candidate | undefined> {
  await mockDelay(100, 200);
  const base = getCandidateById(candidateId);
  if (!base) return undefined;

  const updatedPassport = {
    ...passport,
    completeness: computePassportCompleteness(passport),
  };
  persistOverride(candidateId, { passport: updatedPassport });
  return mergeCandidate({ ...base, passport: updatedPassport });
}

export async function toggleSavedJob(
  candidateId: string,
  jobId: string
): Promise<Candidate | undefined> {
  await mockDelay(50, 100);
  const candidate = await getCandidateByIdAsync(candidateId);
  if (!candidate) return undefined;

  const savedJobIds = candidate.savedJobIds.includes(jobId)
    ? candidate.savedJobIds.filter((id) => id !== jobId)
    : [...candidate.savedJobIds, jobId];

  persistOverride(candidateId, { savedJobIds });
  return { ...candidate, savedJobIds };
}

export async function isJobSaved(
  candidateId: string,
  jobId: string
): Promise<boolean> {
  const candidate = await getCandidateByIdAsync(candidateId);
  return candidate?.savedJobIds.includes(jobId) ?? false;
}

export interface RecommendedJob {
  job: (typeof jobs)[number];
  matchScore: number;
}

export async function getRecommendedJobs(
  candidateId: string,
  limit = 5
): Promise<RecommendedJob[]> {
  await mockDelay();
  const candidate = await getCandidateByIdAsync(candidateId);
  if (!candidate) return [];

  const publishedJobs = jobs.filter((j) => j.status === "published");
  const scored = await Promise.all(
    publishedJobs.map(async (job) => {
      const { score } = await getMatchExplanation(candidateId, job.id);
      return { job, matchScore: score };
    })
  );

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export async function createCandidateProfile(data: {
  userId: string;
  name: string;
  email: string;
}): Promise<Candidate> {
  await mockDelay(100, 200);
  const id = `cand-${Date.now()}`;
  const candidate: Candidate = {
    id,
    userId: data.userId,
    name: data.name,
    savedJobIds: [],
    passport: {
      headline: "",
      summary: "",
      phone: "",
      email: data.email,
      experience: [],
      education: [],
      skills: [],
      preferences: {
        desiredRoles: [],
        salaryExpectation: { min: 0, max: 0, currency: "BDT", period: "monthly" },
        preferredLocations: [],
        workMode: [],
        noticePeriodDays: 30,
      },
      visibility: "open",
      completeness: 0,
    },
  };

  persistOverride(id, candidate);
  fixtureCandidates.push(candidate);
  return candidate;
}

export { fixtureCandidates as candidates, getCandidateById, getCandidateByUserId };
