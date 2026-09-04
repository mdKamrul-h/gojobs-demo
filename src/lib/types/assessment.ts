import type { MatchDimension } from "./common";

export type AssessmentOutcome = "strong_fit" | "moderate_fit" | "limited_fit";

export interface AssessmentQuestionAnswer {
  question: string;
  answer: string;
}

export interface RoleAssessmentResult {
  id: string;
  title: string;
  type: "mcq" | "short_answer";
  questions: AssessmentQuestionAnswer[];
  completedAt: string;
  durationMinutes?: number;
}

export interface GeneralAssessment {
  id: string;
  applicationId: string;
  candidateId?: string;
  jobId: string;
  dimensions: MatchDimension[];
  outcome: AssessmentOutcome;
  summary: string;
  completedAt: string;
  questions?: AssessmentQuestionAnswer[];
  durationMinutes?: number;
  roleAssessments?: RoleAssessmentResult[];
}
