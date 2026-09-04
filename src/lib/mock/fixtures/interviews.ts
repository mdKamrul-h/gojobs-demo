import type { AssessmentTemplate, InterviewSession, RoleAssessment } from "@/lib/types";

export const assessmentTemplates: AssessmentTemplate[] = [
  {
    id: "tpl-accountant",
    name: "Accountant — Core Competencies",
    occupation: "accountant",
    questionCount: 15,
    durationMinutes: 25,
    enabled: true,
  },
  {
    id: "tpl-hr",
    name: "HR Manager — People Operations",
    occupation: "hr_manager",
    questionCount: 12,
    durationMinutes: 20,
    enabled: true,
  },
  {
    id: "tpl-engineer",
    name: "Software Engineer — Technical Screen",
    occupation: "software_engineer",
    questionCount: 20,
    durationMinutes: 45,
    enabled: false,
  },
];

export const roleAssessments: RoleAssessment[] = [
  {
    id: "ra-accountant-001",
    jobId: "job-001",
    title: "Senior Accountant Assessment",
    occupation: "accountant",
    durationMinutes: 25,
    questionCount: 5,
    type: "mixed",
    questions: [
      {
        id: "q1",
        text: "Which standard governs revenue recognition for subscription services?",
        type: "mcq",
        options: ["IFRS 15", "IAS 16", "IAS 38", "IFRS 9"],
      },
      {
        id: "q2",
        text: "Describe your approach to month-end close for a multi-entity group.",
        type: "short_answer",
      },
      {
        id: "q3",
        text: "What is the VAT rate on most goods and services in Bangladesh?",
        type: "mcq",
        options: ["5%", "7.5%", "10%", "15%"],
      },
      {
        id: "q4",
        text: "How do you reconcile intercompany balances?",
        type: "short_answer",
      },
      {
        id: "q5",
        text: "Which tool do you prefer for financial reporting automation?",
        type: "mcq",
        options: ["Excel + Power Query", "SAP", "Oracle", "QuickBooks"],
      },
    ],
  },
];

export const interviewSessions: InterviewSession[] = [
  {
    id: "int-ai-001",
    applicationId: "app-001",
    candidateId: "cand-001",
    jobId: "job-001",
    jobTitle: "Senior Accountant",
    type: "ai",
    status: "scheduled",
    durationMinutes: 20,
    questions: [
      { id: "aiq1", text: "Tell me about your experience with VAT filing in Bangladesh.", type: "video" },
      { id: "aiq2", text: "Describe a time you identified a significant reconciliation error.", type: "video" },
      { id: "aiq3", text: "How do you prioritize tasks during month-end close?", type: "video" },
    ],
  },
  {
    id: "int-human-001",
    applicationId: "app-001",
    candidateId: "cand-001",
    jobId: "job-001",
    jobTitle: "Senior Accountant",
    type: "human",
    status: "scheduled",
    scheduledAt: "2026-03-10T09:00:00Z",
    durationMinutes: 45,
    questions: [],
    scorecard: [
      { id: "sc1", label: "Technical accounting knowledge", score: null, maxScore: 5 },
      { id: "sc2", label: "Communication", score: null, maxScore: 5 },
      { id: "sc3", label: "Problem solving", score: null, maxScore: 5 },
      { id: "sc4", label: "Cultural fit", score: null, maxScore: 5 },
    ],
  },
  {
    id: "int-ai-completed",
    applicationId: "app-003",
    candidateId: "cand-002",
    jobId: "job-003",
    jobTitle: "HR Manager — RMG",
    type: "ai",
    status: "completed",
    durationMinutes: 20,
    questions: [],
    transcript: [
      { role: "interviewer", text: "Welcome. Tell me about your factory HR experience.", timestamp: "2026-02-20T10:00:00Z" },
      { role: "candidate", text: "I managed 2,000+ workers across three shifts at a Gazipur factory.", timestamp: "2026-02-20T10:01:30Z" },
      { role: "interviewer", text: "How do you handle grievance escalation?", timestamp: "2026-02-20T10:03:00Z" },
      { role: "candidate", text: "We use a tiered committee process aligned with labor law requirements.", timestamp: "2026-02-20T10:04:15Z" },
    ],
    summary: "Strong factory HR experience with clear compliance awareness. Recommend human interview.",
  },
];

export function getRoleAssessment(id: string): RoleAssessment | undefined {
  return roleAssessments.find((a) => a.id === id);
}

export function getInterviewSession(id: string): InterviewSession | undefined {
  return interviewSessions.find((i) => i.id === id);
}

export function getInterviewsByCandidate(candidateId: string): InterviewSession[] {
  return interviewSessions.filter((i) => i.candidateId === candidateId);
}

export function getInterviewsForEmployer(): InterviewSession[] {
  return interviewSessions;
}
