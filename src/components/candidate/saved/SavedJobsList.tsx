"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { Bookmark, BookmarkX } from "lucide-react";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { toggleSavedJob } from "@/lib/mock/services/candidates";
import { getJobByIdAsync } from "@/lib/mock/services/jobs";
import { companies } from "@/lib/mock/fixtures/companies";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SavedJobEntry {
  job: Job;
  companyName: string;
}

export function SavedJobsList() {
  const t = useTranslations("candidate.saved");
  const tApps = useTranslations("candidate.applications.detail");
  const { candidate, loading, refresh } = useCandidate();
  const [savedJobs, setSavedJobs] = useState<SavedJobEntry[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (!candidate) return;
    async function load() {
      setLoadingJobs(true);
      const jobs = await Promise.all(
        candidate!.savedJobIds.map(async (id) => {
          const job = await getJobByIdAsync(id);
          if (!job) return null;
          const company = companies.find((c) => c.id === job.companyId);
          return { job, companyName: company?.name ?? "Company" };
        })
      );
      setSavedJobs(jobs.filter(Boolean) as SavedJobEntry[]);
      setLoadingJobs(false);
    }
    load();
  }, [candidate]);

  const handleUnsave = async (jobId: string) => {
    if (!candidate) return;
    await toggleSavedJob(candidate.id, jobId);
    setSavedJobs((prev) => prev.filter((s) => s.job.id !== jobId));
    await refresh();
    toast.success(t("unsave"));
  };

  if (loading || !candidate) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CandidateNav />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {loadingJobs ? (
        <LoadingState />
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center">
          <EmptyState
            title={t("empty")}
            description={t("emptyDescription")}
            icon={Bookmark}
          />
          <Link href="/jobs" className="mt-4">
            <Button variant="outline">{t("browseJobs")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map(({ job, companyName }) => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      <Link href={`/jobs/${job.slug}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{companyName}</CardDescription>
                  </div>
                  <Badge variant="secondary">{job.workMode.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <SalaryDisplay salary={job.salary} />
                <div className="flex gap-2">
                  <Link href={`/jobs/${job.slug}`}>
                    <Button size="sm" variant="outline">
                      {tApps("viewJob")}
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUnsave(job.id)}
                  >
                    <BookmarkX className="mr-1 h-4 w-4" />
                    {t("unsave")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
