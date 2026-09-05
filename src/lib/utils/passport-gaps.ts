import type { CareerPassport } from "@/lib/types";

const CHECKS: { key: string; missing: (p: CareerPassport) => boolean }[] = [
  { key: "headline", missing: (p) => !p.headline?.trim() },
  { key: "summary", missing: (p) => !p.summary?.trim() },
  { key: "phone", missing: (p) => !p.phone?.trim() },
  { key: "email", missing: (p) => !p.email?.trim() },
  { key: "experience", missing: (p) => p.experience.length === 0 },
  { key: "education", missing: (p) => p.education.length === 0 },
  { key: "skills", missing: (p) => p.skills.length < 3 },
  { key: "desiredRoles", missing: (p) => p.preferences.desiredRoles.length === 0 },
];

export function getMissingPassportFields(passport: CareerPassport, limit = 2): string[] {
  return CHECKS.filter((check) => check.missing(passport))
    .slice(0, limit)
    .map((check) => check.key);
}
