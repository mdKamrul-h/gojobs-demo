import { applications } from "@/lib/mock/fixtures/applications";
import { companies } from "@/lib/mock/fixtures/companies";
import { jobs } from "@/lib/mock/fixtures/jobs";
import { getCompanyById } from "@/lib/mock/fixtures/companies";
import type { Company, Job } from "@/lib/types";

export type FlagReason = "unverified_employer" | "salary_mismatch" | "high_applicants" | "duplicate_title";

export interface FlaggedJob {
  job: Job;
  company: Company | undefined;
  reasons: FlagReason[];
  flaggedAt: string;
}

export interface PlatformStats {
  publishedJobs: number;
  totalCompanies: number;
  totalApplications: number;
  pendingTrustReviews: number;
  flaggedJobs: number;
}

function getFlagReasons(job: Job, company: Company | undefined): FlagReason[] {
  const reasons: FlagReason[] = [];

  if (company?.trustStatus === "pending") {
    reasons.push("unverified_employer");
  }

  if (job.seniority === "entry" && job.salary.max > 80000) {
    reasons.push("salary_mismatch");
  }

  if ((job.applicantCount ?? 0) >= 70) {
    reasons.push("high_applicants");
  }

  const duplicateCount = jobs.filter(
    (j) => j.title === job.title && j.companyId !== job.companyId && j.status === "published",
  ).length;
  if (duplicateCount > 0) {
    reasons.push("duplicate_title");
  }

  return reasons;
}

export function getFlaggedJobs(): FlaggedJob[] {
  return jobs
    .filter((job) => job.status === "published")
    .map((job) => ({
      job,
      company: getCompanyById(job.companyId),
      reasons: getFlagReasons(job, getCompanyById(job.companyId)),
      flaggedAt: job.postedAt,
    }))
    .filter((item) => item.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length);
}

export function getTrustReviewQueue(): Company[] {
  return companies.filter((c) => c.trustStatus === "pending");
}

export function getPlatformStats(): PlatformStats {
  const flagged = getFlaggedJobs();
  return {
    publishedJobs: jobs.filter((j) => j.status === "published").length,
    totalCompanies: companies.length,
    totalApplications: applications.length,
    pendingTrustReviews: getTrustReviewQueue().length,
    flaggedJobs: flagged.length,
  };
}
