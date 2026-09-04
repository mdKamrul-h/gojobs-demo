import type { GeneralAssessment, MatchDimension } from "@/lib/types";
import {
  assessments as fixtureAssessments,
  getAssessmentByApplicationId,
  getAssessmentById,
} from "../fixtures/assessments";
import { getApplicationByIdAsync } from "./applications";
import { mockDelay } from "../delay";

const STORAGE_KEY = "gojobs_assessments";

function getPersistedAssessments(): GeneralAssessment[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as GeneralAssessment[]) : [];
  } catch {
    return [];
  }
}

function persistAssessment(assessment: GeneralAssessment): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getPersistedAssessments().filter((a) => a.id !== assessment.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, assessment]));
  } catch {
    // ignore storage errors
  }
}

function getAllAssessments(): GeneralAssessment[] {
  const persisted = getPersistedAssessments();
  const fixtureIds = new Set(fixtureAssessments.map((a) => a.id));
  const newAssessments = persisted.filter((a) => !fixtureIds.has(a.id));
  return [...fixtureAssessments, ...newAssessments];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options?: string[];
}

export const generalAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: "ga-q1",
    question: "How would you describe your experience with the core requirements of this role?",
    options: [
      "Extensive hands-on experience",
      "Moderate experience with some gaps",
      "Limited but growing experience",
      "No direct experience yet",
    ],
  },
  {
    id: "ga-q2",
    question: "Which best describes your proficiency with the key skills listed in this job?",
    options: [
      "Expert — I could mentor others",
      "Advanced — I work independently",
      "Intermediate — I need occasional guidance",
      "Beginner — I'm still learning",
    ],
  },
  {
    id: "ga-q3",
    question: "How familiar are you with the industry or sector this role operates in?",
    options: [
      "Very familiar — multiple years in this sector",
      "Somewhat familiar — related experience",
      "Limited familiarity",
      "New to this sector",
    ],
  },
  {
    id: "ga-q4",
    question: "How do you typically handle complex tasks or projects in this domain?",
    options: [
      "Lead and deliver end-to-end",
      "Contribute as a key team member",
      "Support with guidance from seniors",
      "Still building this capability",
    ],
  },
];

function scoreAnswer(answerIndex: number): number {
  return [100, 70, 45, 20][answerIndex] ?? 50;
}

function deriveOutcome(avgScore: number): GeneralAssessment["outcome"] {
  if (avgScore >= 75) return "strong_fit";
  if (avgScore >= 50) return "moderate_fit";
  return "limited_fit";
}

function deriveLevel(score: number): MatchDimension["level"] {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  return "limited";
}

export async function getAssessments(): Promise<GeneralAssessment[]> {
  await mockDelay();
  return getAllAssessments();
}

export async function getAssessmentByIdAsync(
  id: string
): Promise<GeneralAssessment | undefined> {
  await mockDelay();
  return getAllAssessments().find((a) => a.id === id) ?? getAssessmentById(id);
}

export async function getAssessmentByApplicationIdAsync(
  applicationId: string
): Promise<GeneralAssessment | undefined> {
  await mockDelay();
  return (
    getAllAssessments().find((a) => a.applicationId === applicationId) ??
    getAssessmentByApplicationId(applicationId)
  );
}

export async function submitGeneralAssessment(data: {
  applicationId: string;
  answers: { questionId: string; answerIndex: number }[];
}): Promise<GeneralAssessment> {
  await mockDelay(300, 500);

  const application = await getApplicationByIdAsync(data.applicationId);
  if (!application || !application.candidateId) {
    throw new Error("Application not found");
  }

  const scores = data.answers.map((a) => scoreAnswer(a.answerIndex));
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const outcome = deriveOutcome(avgScore);

  const dimensions: MatchDimension[] = application.matchDimensions.map((dim, i) => ({
    ...dim,
    level: deriveLevel(scores[i % scores.length] ?? avgScore),
    evidence: "assessment_derived" as const,
  }));

  const outcomeMessages: Record<GeneralAssessment["outcome"], string> = {
    strong_fit:
      "Your responses indicate strong alignment with this role's requirements. We recommend proceeding to the next stage.",
    moderate_fit:
      "Your responses show relevant overlap with this role. Some areas may benefit from further development, but you appear to be a viable candidate.",
    limited_fit:
      "Your responses suggest limited alignment with key requirements. Consider roles that better match your current experience, or invest in building relevant skills.",
  };

  const assessment: GeneralAssessment = {
    id: `ga-${Date.now()}`,
    applicationId: data.applicationId,
    candidateId: application.candidateId,
    jobId: application.jobId,
    dimensions: dimensions.length > 0 ? dimensions : [
      { label: "Role requirements", level: deriveLevel(avgScore), evidence: "assessment_derived" },
      { label: "Core skills", level: deriveLevel(avgScore - 5), evidence: "assessment_derived" },
      { label: "Industry experience", level: deriveLevel(avgScore + 5), evidence: "assessment_derived" },
    ],
    outcome,
    summary: outcomeMessages[outcome],
    completedAt: new Date().toISOString(),
  };

  persistAssessment(assessment);
  return assessment;
}

export { fixtureAssessments as assessments };
