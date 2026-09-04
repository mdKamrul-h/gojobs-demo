import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  JobCard,
  JobFilters,
  JobSearchBar,
  JobPagination,
} from "@/components/marketplace";
import { EmptyState } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobs } from "@/lib/mock/services/jobs";
import type {
  Industry,
  Occupation,
  Seniority,
  WorkMode,
} from "@/lib/types";

const PAGE_SIZE = 9;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const val = params[key];
  return typeof val === "string" ? val : undefined;
}

export default async function JobsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("jobs");

  const keyword = getParam(sp, "q");
  const divisionId = getParam(sp, "division");
  const districtId = getParam(sp, "district");
  const workMode = getParam(sp, "workMode") as WorkMode | undefined;
  const occupation = getParam(sp, "occupation") as Occupation | undefined;
  const industry = getParam(sp, "industry") as Industry | undefined;
  const seniority = getParam(sp, "seniority") as Seniority | undefined;
  const salaryMin = getParam(sp, "salaryMin");
  const salaryMax = getParam(sp, "salaryMax");
  const sortField = getParam(sp, "sort") ?? "relevance";
  const page = Math.max(1, parseInt(getParam(sp, "page") ?? "1", 10));

  const allJobs = await getJobs(
    {
      keyword,
      divisionId,
      districtId,
      workMode,
      occupation,
      industry,
      seniority,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
    },
    {
      field: sortField as "relevance" | "date" | "salary",
      direction: sortField === "salary" ? "desc" : "desc",
    }
  );

  const totalPages = Math.ceil(allJobs.length / PAGE_SIZE);
  const paginatedJobs = allJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">{t("title")}</h1>

      <div className="mb-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <JobSearchBar />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <JobFilters />
          </Suspense>
        </aside>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {t("resultsCount", { count: allJobs.length })}
          </p>

          {paginatedJobs.length === 0 ? (
            <EmptyState
              title={t("noResults")}
              description={t("noResultsDesc")}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} locale={locale} />
              ))}
            </div>
          )}

          <Suspense fallback={null}>
            <JobPagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
