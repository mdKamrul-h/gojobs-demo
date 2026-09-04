import type {
  Industry,
  Job,
  JobStatus,
  Occupation,
  Seniority,
  WorkMode,
} from "@/lib/types";
import { getCompanyById } from "../fixtures/companies";
import {
  getFeaturedJobs,
  getJobById,
  getJobBySlug,
  getJobsByCompanyId,
  jobs,
} from "../fixtures/jobs";
import { getApplicantCountByJobId } from "../fixtures/applications";
import { mockDelay } from "../delay";

function withApplicantCount(job: Job): Job {
  return { ...job, applicantCount: getApplicantCountByJobId(job.id) };
}

export interface JobFilters {
  keyword?: string;
  occupation?: Occupation;
  workMode?: WorkMode;
  divisionId?: string;
  districtId?: string;
  salaryMin?: number;
  salaryMax?: number;
  industry?: Industry;
  seniority?: Seniority;
  status?: JobStatus;
  companyId?: string;
}

export interface JobSortOption {
  field: "relevance" | "date" | "salary";
  direction: "asc" | "desc";
}

export async function getJobs(
  filters?: JobFilters,
  sort?: JobSortOption
): Promise<Job[]> {
  await mockDelay();
  let result = jobs.filter((j) => j.status === (filters?.status ?? "published"));

  if (filters?.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        j.occupation.toLowerCase().includes(kw)
    );
  }

  if (filters?.occupation) {
    result = result.filter((j) => j.occupation === filters.occupation);
  }

  if (filters?.workMode) {
    result = result.filter((j) => j.workMode === filters.workMode);
  }

  if (filters?.divisionId) {
    result = result.filter((j) => j.location.divisionId === filters.divisionId);
  }

  if (filters?.districtId) {
    result = result.filter((j) => j.location.districtId === filters.districtId);
  }

  if (filters?.salaryMin) {
    result = result.filter((j) => j.salary.max >= filters.salaryMin!);
  }

  if (filters?.salaryMax) {
    result = result.filter((j) => j.salary.min <= filters.salaryMax!);
  }

  if (filters?.industry) {
    result = result.filter((j) => {
      const company = getCompanyById(j.companyId);
      return company?.industry === filters.industry;
    });
  }

  if (filters?.seniority) {
    result = result.filter((j) => j.seniority === filters.seniority);
  }

  if (filters?.companyId) {
    result = result.filter((j) => j.companyId === filters.companyId);
  }

  if (sort) {
    result = [...result].sort((a, b) => {
      const dir = sort.direction === "asc" ? 1 : -1;
      switch (sort.field) {
        case "date":
          return dir * (new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
        case "salary":
          return dir * (a.salary.max - b.salary.max);
        default:
          return dir * ((b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    });
  }

  return result.map(withApplicantCount);
}

export async function getJobBySlugAsync(slug: string): Promise<Job | undefined> {
  await mockDelay();
  return getJobBySlug(slug);
}

export async function getJobByIdAsync(id: string): Promise<Job | undefined> {
  await mockDelay();
  return getJobById(id);
}

export async function getFeaturedJobsAsync(): Promise<Job[]> {
  await mockDelay();
  return getFeaturedJobs();
}

export async function getJobsByCompanyIdAsync(companyId: string): Promise<Job[]> {
  await mockDelay();
  return getJobsByCompanyId(companyId);
}

export async function getRelatedJobsAsync(
  jobId: string,
  limit = 4
): Promise<Job[]> {
  await mockDelay();
  const job = getJobById(jobId);
  if (!job) return [];

  const related = jobs.filter(
    (j) =>
      j.id !== jobId &&
      j.status === "published" &&
      (j.occupation === job.occupation || j.companyId === job.companyId)
  );

  return related.slice(0, limit);
}

export { getJobs as getJobsSync, jobs };
