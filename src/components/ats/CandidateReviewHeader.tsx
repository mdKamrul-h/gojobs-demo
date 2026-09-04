"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeftOpen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Application, ApplicationStage, Job } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CandidateReviewHeaderProps {
  job: Job;
  jobId: string;
  application: Application;
  candidateName: string;
  prevAppId?: string;
  nextAppId?: string;
  cvOpen: boolean;
  onToggleCv: () => void;
}

export function CandidateReviewHeader({
  job,
  jobId,
  application,
  candidateName,
  prevAppId,
  nextAppId,
  cvOpen,
  onToggleCv,
}: CandidateReviewHeaderProps) {
  const t = useTranslations("employer.review");

  return (
    <div className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-4 bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <Link
            href={`/employer/jobs/${jobId}/applicants`}
            className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("backToAts")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight truncate">{candidateName}</h1>
            <Badge variant="secondary">{t(`stages.${application.stage as ApplicationStage}`)}</Badge>
            {application.matchScore > 0 && (
              <Badge variant="outline">{t("overlapBadge", { percent: application.matchScore })}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{job.title}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!cvOpen && (
            <Button variant="outline" size="sm" className="hidden lg:inline-flex gap-1" onClick={onToggleCv}>
              <PanelLeftOpen className="h-4 w-4" />
              {t("cv.showCv")}
            </Button>
          )}
          {prevAppId ? (
            <Link
              href={`/employer/jobs/${jobId}/applicants/${prevAppId}`}
              aria-label={t("prevApplicant")}
              className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label={t("prevApplicant")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {nextAppId ? (
            <Link
              href={`/employer/jobs/${jobId}/applicants/${nextAppId}`}
              aria-label={t("nextApplicant")}
              className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label={t("nextApplicant")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
