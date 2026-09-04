import type { MatchDimension, SalaryRange } from "./common";
import type { TalentCompetency } from "./talent";

export type ApplicationStage =
  | "applied"
  | "reviewed"
  | "screening"
  | "general_assessment"
  | "ai_interview"
  | "human_interview"
  | "employer_checks"
  | "offer"
  | "hired"
  | "rejected";

export type ApplicationSource = "gojobs" | "referral" | "job_board" | "direct";

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  cvFileName?: string;
  coverNote?: string;
  headline?: string;
  location?: string;
  salaryExpectation?: SalaryRange;
  availability?: string;
  noticePeriod?: string;
}

export interface ActivityLogEntry {
  id: string;
  type:
    | "applied"
    | "reviewed"
    | "stage_change"
    | "assessment_completed"
    | "note_added"
    | "interview_scheduled";
  label: string;
  timestamp: string;
}

export interface RecruiterNote {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: "cv" | "certificate" | "portfolio" | "other";
  uploadedAt: string;
}

export interface ScreeningAnswer {
  questionId: string;
  answer: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId?: string;
  guestInfo?: GuestInfo;
  stage: ApplicationStage;
  matchScore: number;
  matchDimensions: MatchDimension[];
  screeningAnswers: ScreeningAnswer[];
  appliedAt: string;
  updatedAt: string;
  notes?: string[];
  source?: ApplicationSource;
  matchExplanation?: string;
  metRequirements?: string[];
  unmetRequirements?: string[];
  activityLog?: ActivityLogEntry[];
  recruiterNotes?: RecruiterNote[];
  consentTimestamp?: string;
  documents?: ApplicationDocument[];
  portfolioLinks?: string[];
  competencies?: TalentCompetency[];
  availability?: string;
  location?: string;
}
