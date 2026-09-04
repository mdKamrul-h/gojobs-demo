import { getTranslations } from "next-intl/server";
import { JobCard } from "./JobCard";
import type { Job } from "@/lib/types";

interface RelatedJobsProps {
  jobs: Job[];
  locale: string;
}

export async function RelatedJobs({ jobs, locale }: RelatedJobsProps) {
  const t = await getTranslations("jobs");

  if (jobs.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{t("relatedJobs")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} locale={locale} />
        ))}
      </div>
    </section>
  );
}
