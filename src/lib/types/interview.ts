export type InterviewType = "ai" | "human";
export type InterviewStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface InterviewQuestion {
  id: string;
  text: string;
  type: "mcq" | "short_answer" | "video";
  options?: string[];
}

export interface InterviewTranscriptEntry {
  role: "interviewer" | "candidate";
  text: string;
  timestamp: string;
}

export interface ScorecardCriterion {
  id: string;
  label: string;
  score: number | null;
  maxScore: number;
  notes?: string;
}

export interface InterviewSession {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt?: string;
  durationMinutes: number;
  questions: InterviewQuestion[];
  transcript?: InterviewTranscriptEntry[];
  scorecard?: ScorecardCriterion[];
  summary?: string;
}

export interface RoleAssessment {
  id: string;
  jobId: string;
  title: string;
  occupation: string;
  durationMinutes: number;
  questionCount: number;
  type: "mcq" | "mixed";
  questions: InterviewQuestion[];
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  occupation: string;
  questionCount: number;
  durationMinutes: number;
  enabled: boolean;
}
