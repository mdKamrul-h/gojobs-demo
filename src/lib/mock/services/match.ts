import type { MatchDimension } from "@/lib/types";
import { getCandidateById } from "../fixtures/candidates";
import { getJobById } from "../fixtures/jobs";
import { mockDelay } from "../delay";

export function computeMatchScore(
  candidateSkills: string[],
  jobRequirements: string[]
): number {
  if (jobRequirements.length === 0) return 0;
  const normalizedSkills = candidateSkills.map((s) => s.toLowerCase());
  const matches = jobRequirements.filter((req) =>
    normalizedSkills.some(
      (skill) =>
        skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill)
    )
  );
  return Math.round((matches.length / jobRequirements.length) * 100);
}

export async function getMatchExplanation(
  candidateId: string,
  jobId: string
): Promise<{ score: number; dimensions: MatchDimension[] }> {
  await mockDelay();
  const candidate = getCandidateById(candidateId);
  const job = getJobById(jobId);

  if (!candidate || !job) {
    return { score: 0, dimensions: [] };
  }

  const skillNames = candidate.passport.skills.map((s) => s.name);
  const requirements = [
    ...job.hardRequirements.map((r) => r.label),
    ...job.softRequirements.map((r) => r.label),
  ];

  const score = computeMatchScore(skillNames, requirements);

  const dimensions: MatchDimension[] = requirements.slice(0, 5).map((label) => {
    const hasMatch = skillNames.some(
      (s) =>
        s.toLowerCase().includes(label.toLowerCase().split(" ")[0]) ||
        label.toLowerCase().includes(s.toLowerCase().split(" ")[0])
    );
    return {
      label,
      level: hasMatch ? "strong" : score >= 50 ? "moderate" : "limited",
      evidence: hasMatch ? "cv_extracted" : "candidate_provided",
    };
  });

  return { score, dimensions };
}
