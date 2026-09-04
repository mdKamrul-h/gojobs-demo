import type { EvidenceSource } from "./common";

export type CompetencyConfidence = "high" | "medium" | "low";

export interface TalentCompetency {
  id: string;
  name: string;
  category: string;
  confidence: CompetencyConfidence;
  recencyMonths: number;
  evidence: EvidenceSource;
  evidenceDetail: string;
}

export interface TalentProfile {
  id: string;
  candidateId: string;
  name: string;
  headline: string;
  location: string;
  occupation: string;
  overlapPercent: number;
  competencies: TalentCompetency[];
  salaryBand: { min: number; max: number; currency: string };
  lastActive: string;
}

export interface SalaryBenchmark {
  occupation: string;
  location: string;
  currency: string;
  p25: number;
  p50: number;
  p75: number;
  sampleSize: number;
  updatedAt: string;
}
