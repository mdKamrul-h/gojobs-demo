export type EvidenceSource =
  | "candidate_provided"
  | "cv_extracted"
  | "assessment_derived"
  | "interview_derived"
  | "recruiter_entered";

export type MatchLevel = "strong" | "moderate" | "limited" | "none";

export type WorkMode = "on_site" | "hybrid" | "remote";

export type JobStatus = "draft" | "published" | "closed";

export type UserRole = "public" | "candidate" | "recruiter" | "admin";

export type VisibilityStatus = "actively_looking" | "open" | "private";

export type TrustStatus = "pending" | "approved" | "rejected";

export interface SalaryRange {
  min: number;
  max: number;
  currency: "BDT" | "USD" | "EUR" | "AED" | string;
  period: "monthly" | "yearly";
}

export interface MatchDimension {
  label: string;
  level: MatchLevel;
  evidence: EvidenceSource;
  description?: string;
}

export interface Requirement {
  id: string;
  label: string;
  type: "hard" | "soft";
  description?: string;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: "text" | "yes_no" | "multiple_choice";
  options?: string[];
  required: boolean;
}
