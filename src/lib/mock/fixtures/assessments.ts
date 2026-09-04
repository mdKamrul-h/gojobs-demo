import type { GeneralAssessment } from "@/lib/types";

export const assessments: GeneralAssessment[] = [
  {
    id: "ga-001",
    applicationId: "app-001",
    candidateId: "cand-001",
    jobId: "job-001",
    dimensions: [
      { label: "VAT/tax compliance", level: "strong", evidence: "assessment_derived", description: "Demonstrated thorough knowledge of NBR regulations" },
      { label: "Financial reporting", level: "strong", evidence: "assessment_derived" },
      { label: "Audit coordination", level: "moderate", evidence: "assessment_derived", description: "Good understanding, limited large-scale audit experience" },
      { label: "Team leadership", level: "moderate", evidence: "assessment_derived" },
      { label: "Banking sector knowledge", level: "strong", evidence: "assessment_derived" },
    ],
    outcome: "strong_fit",
    summary:
      "Rahima shows strong alignment with the Senior Accountant role requirements. Her VAT compliance and financial reporting skills are particularly well-developed. Consider proceeding to interview.",
    completedAt: "2026-02-28T16:00:00Z",
    durationMinutes: 42,
    questions: [
      {
        question: "Describe your experience preparing VAT returns for NBR compliance.",
        answer:
          "At Mutual Trust Bank I prepare monthly VAT schedules, reconcile input/output VAT, and file returns through the NBR portal. I also coordinate with external auditors on VAT-related findings.",
      },
      {
        question: "How do you ensure accuracy in monthly financial reporting under tight deadlines?",
        answer:
          "I use a checklist-based close process, automated reconciliations in Excel, and peer review for material entries. Last year we reduced reporting errors by implementing a 3-day close calendar.",
      },
      {
        question: "Tell us about a time you identified a compliance issue before an audit.",
        answer:
          "I noticed a mismatch in input VAT credits during a quarterly review and traced it to misclassified vendor invoices. We corrected filings before the external audit, avoiding penalties.",
      },
      {
        question: "How comfortable are you leading a small accounting team?",
        answer:
          "I currently mentor two junior accountants on VAT workflows and month-end tasks. I am comfortable with delegation but prefer structured handoffs during peak close periods.",
      },
      {
        question: "What is your timeline for completing CA qualification?",
        answer:
          "I am a CA Finalist with two papers remaining, expected completion within the next 12 months.",
      },
    ],
  },
  {
    id: "ga-002",
    applicationId: "app-003",
    candidateId: "cand-002",
    jobId: "job-003",
    dimensions: [
      { label: "RMG HR experience", level: "strong", evidence: "assessment_derived" },
      { label: "Labour law compliance", level: "strong", evidence: "assessment_derived" },
      { label: "Large workforce management", level: "moderate", evidence: "assessment_derived", description: "Managed 3000 workers, role requires 5000+" },
      { label: "Recruitment strategy", level: "strong", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Karim has solid HR fundamentals and strong RMG experience. Scale of workforce managed is slightly below requirement but transferable skills are evident.",
    completedAt: "2026-02-25T14:00:00Z",
    durationMinutes: 38,
    questions: [
      {
        question: "Describe your experience managing HR operations in an RMG factory.",
        answer:
          "At Standard Group I oversee recruitment, attendance, payroll coordination, and grievance handling for 3000+ workers across two production units in Gazipur.",
      },
      {
        question: "How do you stay current with Bangladesh labour law changes?",
        answer:
          "I subscribe to BGMEA labour law updates, attend annual compliance workshops, and maintain a checklist aligned with the Bangladesh Labour Act for factory audits.",
      },
      {
        question: "Give an example of resolving a complex employee relations issue.",
        answer:
          "When a production line dispute threatened a shutdown, I facilitated mediation between workers and line supervisors, documented agreements, and prevented escalation to the labour office.",
      },
      {
        question: "How would you adapt your approach for a 5000+ worker factory?",
        answer:
          "I would extend our tiered supervisor model, strengthen shift-based HR coverage, and implement digital grievance tracking to maintain response times at scale.",
      },
      {
        question: "What HR metrics do you track for factory operations?",
        answer:
          "Attrition rate, absenteeism by line, time-to-fill for production roles, and grievance resolution turnaround. We reduced attrition by 25% over three years.",
      },
    ],
  },
  {
    id: "ga-003",
    applicationId: "app-007",
    candidateId: "cand-004",
    jobId: "job-009",
    dimensions: [
      { label: "Backend development", level: "strong", evidence: "assessment_derived" },
      { label: "Payment systems", level: "strong", evidence: "assessment_derived" },
      { label: "Microservices architecture", level: "moderate", evidence: "assessment_derived" },
      { label: "Java/Go proficiency", level: "limited", evidence: "assessment_derived", description: "Primary experience in Node.js, limited Java/Go" },
      { label: "Code quality practices", level: "strong", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Tanvir demonstrates strong engineering fundamentals and relevant payment domain experience. Java/Go gap can be addressed with onboarding support.",
    completedAt: "2026-02-10T11:00:00Z",
  },
  {
    id: "ga-004",
    applicationId: "app-014",
    jobId: "job-015",
    dimensions: [
      { label: "Customer service", level: "strong", evidence: "assessment_derived" },
      { label: "MFS product knowledge", level: "strong", evidence: "assessment_derived" },
      { label: "Empathy and patience", level: "strong", evidence: "assessment_derived" },
      { label: "Bangla and English fluency", level: "strong", evidence: "assessment_derived" },
    ],
    outcome: "strong_fit",
    summary:
      "Sultana demonstrates excellent customer service skills with relevant MFS experience. Strong empathy scores make her a top candidate for CSR role.",
    completedAt: "2026-03-04T14:00:00Z",
    durationMinutes: 35,
    questions: [
      {
        question: "A merchant calls upset about a failed bKash transaction. How do you handle it?",
        answer:
          "I listen without interrupting, acknowledge their frustration, verify the transaction ID, check status in the system, and explain next steps clearly in Bangla. If unresolved, I escalate with full documentation.",
      },
      {
        question: "How do you explain MFS limits to a customer unfamiliar with digital payments?",
        answer:
          "I use simple Bangla examples — daily send/receive limits, KYC tiers — and confirm understanding by asking them to repeat the key points.",
      },
      {
        question: "Describe a time you de-escalated an angry customer.",
        answer:
          "A merchant shouted about repeated failed cash-outs. I stayed calm, apologized for the inconvenience, fixed the issue within 20 minutes, and followed up the next day to rebuild trust.",
      },
      {
        question: "How do you manage high call volume during peak hours?",
        answer:
          "I prioritize by urgency, use quick-reference guides for common issues, and take brief notes between calls to avoid repeat questions.",
      },
      {
        question: "Are you comfortable working evening shifts?",
        answer:
          "Yes — I have worked evening shifts at the partner outlet and am flexible with rotating schedules.",
      },
    ],
    roleAssessments: [
      {
        id: "ra-014-csr",
        title: "CSR Scenario Assessment",
        type: "short_answer",
        completedAt: "2026-03-04T13:30:00Z",
        durationMinutes: 15,
        questions: [
          {
            question: "Write a response to a customer whose remittance was delayed.",
            answer:
              "Assalamualaikum — I understand this is urgent. I have checked your transaction and it is pending at the partner bank. Expected resolution within 2 hours. I will call you back once completed. Thank you for your patience.",
          },
        ],
      },
    ],
  },
  {
    id: "ga-005",
    applicationId: "app-015",
    jobId: "job-015",
    dimensions: [
      { label: "Customer communication", level: "strong", evidence: "assessment_derived" },
      { label: "Bangla and English fluency", level: "strong", evidence: "assessment_derived" },
      { label: "Shift flexibility", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Imran shows solid communication skills and language proficiency. Recommend proceeding to AI interview stage.",
    completedAt: "2026-03-03T11:00:00Z",
  },
  {
    id: "ga-006",
    applicationId: "app-022",
    jobId: "job-009",
    dimensions: [
      { label: "Backend development", level: "strong", evidence: "assessment_derived" },
      { label: "Microservices", level: "moderate", evidence: "assessment_derived" },
      { label: "Java experience", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Priya has strong backend fundamentals with growing microservices experience. Java skills are developing but adequate for mid-level role.",
    completedAt: "2026-03-06T10:00:00Z",
  },
  {
    id: "ga-007",
    applicationId: "app-029",
    jobId: "job-011",
    dimensions: [
      { label: "Full stack development", level: "strong", evidence: "assessment_derived" },
      { label: "System design", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Rashed demonstrates competent full stack skills. System design knowledge is adequate but may need growth for senior responsibilities.",
    completedAt: "2026-03-01T15:00:00Z",
  },
  {
    id: "ga-008",
    applicationId: "app-035",
    jobId: "job-019",
    dimensions: [
      { label: "Kubernetes and Docker", level: "strong", evidence: "assessment_derived" },
      { label: "CI/CD pipelines", level: "strong", evidence: "assessment_derived" },
      { label: "Incident management", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "strong_fit",
    summary:
      "Tanjim shows excellent DevOps skills with hands-on Kubernetes and CI/CD experience. Strong fit for payment infrastructure team.",
    completedAt: "2026-03-04T12:00:00Z",
  },
  {
    id: "ga-009",
    applicationId: "app-040",
    jobId: "job-027",
    dimensions: [
      { label: "Product management", level: "strong", evidence: "assessment_derived" },
      { label: "Fintech experience", level: "moderate", evidence: "assessment_derived" },
      { label: "Stakeholder management", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Rafiqul has solid product management fundamentals. Fintech domain knowledge is developing but transferable from adjacent experience.",
    completedAt: "2026-03-03T09:00:00Z",
  },
  {
    id: "ga-010",
    applicationId: "app-044",
    jobId: "job-001",
    dimensions: [
      { label: "VAT/tax compliance", level: "strong", evidence: "assessment_derived" },
      { label: "CA qualification", level: "moderate", evidence: "assessment_derived" },
      { label: "Financial reporting", level: "strong", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Ibrahim shows strong tax compliance knowledge. CA final stage — recommend interview to assess leadership fit.",
    completedAt: "2026-02-27T16:00:00Z",
  },
  {
    id: "ga-011",
    applicationId: "app-048",
    jobId: "job-003",
    dimensions: [
      { label: "RMG HR experience", level: "strong", evidence: "assessment_derived" },
      { label: "Labour law", level: "moderate", evidence: "assessment_derived" },
      { label: "Employee relations", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "moderate_fit",
    summary:
      "Masud has relevant RMG HR experience at mid-scale factories. Labour law knowledge is solid; scale management may need verification.",
    completedAt: "2026-02-26T14:00:00Z",
  },
  {
    id: "ga-012",
    applicationId: "app-053",
    jobId: "job-005",
    dimensions: [
      { label: "Merchandising experience", level: "strong", evidence: "assessment_derived" },
      { label: "Textile background", level: "strong", evidence: "assessment_derived" },
      { label: "Buyer communication", level: "moderate", evidence: "assessment_derived" },
    ],
    outcome: "strong_fit",
    summary:
      "Munni demonstrates strong merchandising and textile expertise. Excellent candidate for export account management.",
    completedAt: "2026-02-24T11:00:00Z",
  },
];

export function getAssessmentById(id: string): GeneralAssessment | undefined {
  return assessments.find((a) => a.id === id);
}

export function getAssessmentByApplicationId(applicationId: string): GeneralAssessment | undefined {
  return assessments.find((a) => a.applicationId === applicationId);
}
