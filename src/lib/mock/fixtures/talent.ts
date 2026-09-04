import type { TalentProfile, SalaryBenchmark } from "@/lib/types";

export const talentProfiles: TalentProfile[] = [
  {
    id: "talent-1",
    candidateId: "cand-001",
    name: "Fatima Rahman",
    headline: "Senior Accountant · VAT & Audit",
    location: "Dhaka, Bangladesh",
    occupation: "accountant",
    overlapPercent: 78,
    salaryBand: { min: 85000, max: 120000, currency: "BDT" },
    lastActive: "2026-03-01T10:00:00Z",
    competencies: [
      {
        id: "tc-1",
        name: "Financial reporting",
        category: "Core",
        confidence: "high",
        recencyMonths: 2,
        evidence: "candidate_provided",
        evidenceDetail: "3 years at BRAC Bank",
      },
      {
        id: "tc-2",
        name: "VAT compliance",
        category: "Regulatory",
        confidence: "high",
        recencyMonths: 1,
        evidence: "assessment_derived",
        evidenceDetail: "Role assessment score 92%",
      },
      {
        id: "tc-3",
        name: "ERP (SAP)",
        category: "Tools",
        confidence: "medium",
        recencyMonths: 8,
        evidence: "cv_extracted",
        evidenceDetail: "Mentioned in CV experience",
      },
    ],
  },
  {
    id: "talent-2",
    candidateId: "cand-002",
    name: "Karim Hassan",
    headline: "HR Manager · RMG Factory Operations",
    location: "Gazipur, Bangladesh",
    occupation: "hr_manager",
    overlapPercent: 71,
    salaryBand: { min: 70000, max: 95000, currency: "BDT" },
    lastActive: "2026-02-28T14:30:00Z",
    competencies: [
      {
        id: "tc-4",
        name: "Workforce planning",
        category: "Core",
        confidence: "high",
        recencyMonths: 3,
        evidence: "interview_derived",
        evidenceDetail: "AI interview competency signal",
      },
      {
        id: "tc-5",
        name: "Labor compliance",
        category: "Regulatory",
        confidence: "medium",
        recencyMonths: 6,
        evidence: "candidate_provided",
        evidenceDetail: "Factory HR lead role",
      },
    ],
  },
  {
    id: "talent-3",
    candidateId: "cand-003",
    name: "Nadia Islam",
    headline: "Backend Engineer · Node.js & PostgreSQL",
    location: "Remote · Bangladesh",
    occupation: "software_engineer",
    overlapPercent: 82,
    salaryBand: { min: 120000, max: 180000, currency: "BDT" },
    lastActive: "2026-03-02T08:15:00Z",
    competencies: [
      {
        id: "tc-6",
        name: "API design",
        category: "Technical",
        confidence: "high",
        recencyMonths: 1,
        evidence: "assessment_derived",
        evidenceDetail: "Technical assessment",
      },
      {
        id: "tc-7",
        name: "System design",
        category: "Technical",
        confidence: "medium",
        recencyMonths: 4,
        evidence: "cv_extracted",
        evidenceDetail: "Lead engineer at fintech startup",
      },
    ],
  },
];

export const salaryBenchmarks: SalaryBenchmark[] = [
  {
    occupation: "accountant",
    location: "Dhaka",
    currency: "BDT",
    p25: 45000,
    p50: 65000,
    p75: 90000,
    sampleSize: 1240,
    updatedAt: "2026-02-15",
  },
  {
    occupation: "hr_manager",
    location: "Dhaka",
    currency: "BDT",
    p25: 55000,
    p50: 75000,
    p75: 105000,
    sampleSize: 890,
    updatedAt: "2026-02-15",
  },
  {
    occupation: "software_engineer",
    location: "Dhaka",
    currency: "BDT",
    p25: 80000,
    p50: 120000,
    p75: 180000,
    sampleSize: 2100,
    updatedAt: "2026-02-15",
  },
];

export function searchTalent(query: string, occupation?: string): TalentProfile[] {
  const q = query.toLowerCase();
  return talentProfiles.filter((p) => {
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.headline.toLowerCase().includes(q) ||
      p.competencies.some((c) => c.name.toLowerCase().includes(q));
    const matchesOccupation = !occupation || p.occupation === occupation;
    return matchesQuery && matchesOccupation;
  });
}

export function getSalaryBenchmark(occupation: string): SalaryBenchmark | undefined {
  return salaryBenchmarks.find((b) => b.occupation === occupation);
}
