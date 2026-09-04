"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApplicationsByCandidateIdAsync } from "@/lib/mock/services/applications";
import { getJobByIdAsync } from "@/lib/mock/services/jobs";
import { companies } from "@/lib/mock/fixtures/companies";
import type { Application, Job } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGE_ORDER: Application["stage"][] = [
  "applied",
  "reviewed",
  "screening",
  "general_assessment",
  "ai_interview",
  "human_interview",
  "employer_checks",
  "offer",
  "hired",
];

function getStageProgress(stage: Application["stage"]): number {
  if (stage === "rejected") return 0;
  const idx = STAGE_ORDER.indexOf(stage);
  return idx >= 0 ? ((idx + 1) / STAGE_ORDER.length) * 100 : 0;
}

interface AppWithJob extends Application {
  job?: Job;
  companyName?: string;
}

export function ApplicationsList() {
  const t = useTranslations("candidate.applications");
  const tMatch = useTranslations("match");
  const tStages = useTranslations("candidate.applications.stages");
  const { candidate, loading } = useCandidate();
  const [apps, setApps] = useState<AppWithJob[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (!candidate) return;
    async function load() {
      setLoadingApps(true);
      const applications = await getApplicationsByCandidateIdAsync(candidate!.id);
      const enriched = await Promise.all(
        applications.map(async (app) => {
          const job = await getJobByIdAsync(app.jobId);
          const company = job
            ? companies.find((c) => c.id === job.companyId)
            : undefined;
          return { ...app, job, companyName: company?.name };
        })
      );
      enriched.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setApps(enriched);
      setLoadingApps(false);
    }
    load();
  }, [candidate]);

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

      {loadingApps ? (
        <LoadingState />
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center">
          <EmptyState
            title={t("empty")}
            description={t("emptyDescription")}
            icon={ClipboardList}
          />
          <Link href="/jobs" className="mt-4">
            <Button variant="outline">{t("browseJobs")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <Link key={app.id} href={`/candidate/applications/${app.id}`}>
              <Card className="transition-colors hover:bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">
                        {app.job?.title ?? "Job"}
                      </CardTitle>
                      <CardDescription>{app.companyName}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.matchScore > 0 && (
                        <Badge variant={app.matchScore >= 50 ? "default" : "secondary"}>
                          {tMatch("matchPercent", { score: app.matchScore })}
                        </Badge>
                      )}
                      <Badge
                        variant={app.stage === "rejected" ? "destructive" : "outline"}
                      >
                        {tStages(app.stage)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          app.stage === "rejected"
                            ? "bg-destructive/50"
                            : "bg-primary"
                        )}
                        style={{ width: `${getStageProgress(app.stage)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {t("appliedAt", {
                        date: new Date(app.appliedAt).toLocaleDateString(),
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
