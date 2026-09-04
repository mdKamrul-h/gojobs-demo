import type { AgentActivity, AgentMessage } from "@/lib/types";

export const careerAgentScript: Record<string, AgentMessage[]> = {
  default: [
    {
      id: "ca-1",
      role: "assistant",
      content:
        "Hi! I'm your Career Agent. I can help you understand job fit, identify skill gaps, and suggest next steps. What would you like to explore?",
      timestamp: new Date().toISOString(),
    },
  ],
  fit: [
    {
      id: "ca-2",
      role: "user",
      content: "How well do I fit the Senior Accountant role at bKash?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ca-3",
      role: "assistant",
      content:
        "Based on your Career Passport, you have 78% relevant overlap. Your VAT compliance and financial reporting competencies are strong (assessment-derived evidence). One gap: ERP experience is only CV-extracted — consider a short assessment to strengthen that signal.",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: "act-1",
          title: "Start role assessment",
          description: "Complete a 25-min accountant assessment to strengthen ERP signal",
          status: "suggested",
          createdAt: new Date().toISOString(),
        },
        {
          id: "act-2",
          title: "View match breakdown",
          description: "See dimensional overlap with evidence sources",
          status: "suggested",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

export const hiringAgentScript: Record<string, AgentMessage[]> = {
  default: [
    {
      id: "ha-1",
      role: "assistant",
      content:
        "I'm your Hiring Agent. I can shortlist candidates, summarize pipeline status, and suggest next actions. What role are you hiring for?",
      timestamp: new Date().toISOString(),
    },
  ],
  shortlist: [
    {
      id: "ha-2",
      role: "user",
      content: "Who should I shortlist for the Senior Accountant role?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ha-3",
      role: "assistant",
      content:
        "I recommend 2 candidates with ≥70% overlap and assessment evidence:\n\n1. Fatima Rahman — 78% overlap, strong VAT & reporting (assessment-derived)\n2. Karim Hassan — 71% overlap, solid compliance background\n\nBoth meet the 50% GA threshold. Approve to move to AI interview stage?",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: "act-h1",
          title: "Approve shortlist",
          description: "Move both candidates to AI interview stage",
          status: "suggested",
          createdAt: new Date().toISOString(),
        },
        {
          id: "act-h2",
          title: "Review individually",
          description: "Open candidate review workspace",
          status: "suggested",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

export const careerAgentActivities: AgentActivity[] = [
  { id: "aa-1", type: "match_analysis", summary: "Analyzed fit for Senior Accountant at bKash", timestamp: "2026-03-01T10:00:00Z" },
  { id: "aa-2", type: "skill_gap", summary: "Identified ERP competency gap — suggested assessment", timestamp: "2026-02-28T15:30:00Z" },
  { id: "aa-3", type: "job_alert", summary: "3 new jobs match your preferences", timestamp: "2026-02-27T09:00:00Z" },
];

export const hiringAgentActivities: AgentActivity[] = [
  { id: "ea-1", type: "shortlist", summary: "Suggested 2 candidates for Senior Accountant", timestamp: "2026-03-01T11:00:00Z" },
  { id: "ea-2", type: "pipeline", summary: "Pipeline summary: 12 applicants, 4 ≥50% overlap", timestamp: "2026-02-28T16:00:00Z" },
];
