import type { EvidenceSource, SalaryRange, VisibilityStatus, WorkMode } from "./common";
import type { Location } from "./location";

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  evidence: EvidenceSource;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface CandidatePreferences {
  desiredRoles: string[];
  salaryExpectation: SalaryRange;
  preferredLocations: Location[];
  workMode: WorkMode[];
  noticePeriodDays: number;
  country?: string;
  timezone?: string;
  workAuthorization?: string[];
  openToRemoteGlobal?: boolean;
}

export interface CareerPassport {
  headline: string;
  summary: string;
  phone: string;
  email: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  preferences: CandidatePreferences;
  visibility: VisibilityStatus;
  completeness: number;
}

export interface Candidate {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  passport: CareerPassport;
  savedJobIds: string[];
}
