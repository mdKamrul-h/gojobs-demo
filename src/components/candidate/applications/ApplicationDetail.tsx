"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle2, Circle } from "lucide-react";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { MatchDimensions } from "@/components/shared/MatchDimensions";
import { GeneralAssessmentFlow } from "@/components/candidate/applications/GeneralAssessmentFlow";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApplicationByIdAsync } from "@/lib/mock/services/applications";
import { getAssessmentByApplicationIdAsync } from "@/lib/mock/services/assessments";
import { getJobByIdAsync } from "@/lib/mock/services/jobs";
import { companies } from "@/lib/mock/fixtures/companies";
import type { Application, ApplicationStage, GeneralAssessment, Job } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES: ApplicationStage[] = [
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

interface ApplicationDetailProps {
  applicationId: string;
}

export function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const t = useTranslations("candidate.applications");
  const tStages = useTranslations("candidate.applications.stages");
  const tMatch = useTranslations("match");
  const { candidate, loading: candidateLoading } = useCandidate();
  const [application, setApplication] = useState<Application | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<GeneralAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const app = await getApplicationByIdAsync(applicationId);
      if (!app) {
        setError(true);
        setLoading(false);
        return;
      }
      setApplication(app);
      const [jobData, assessmentData] = await Promise.all([
        getJobByIdAsync(app.jobId),
        getAssessmentByApplicationIdAsync(app.id),
      ]);
      setJob(jobData ?? null);
      setAssessment(assessmentData ?? null);
      setLoading(false);
    }
    load();
  }, [applicationId]);

  if (candidateLoading || loading) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  if (error || !application) {
    return <ErrorState message={t("empty")} />;
  }

  if (candidate && application.candidateId && application.candidateId !== candidate.id) {
    return <ErrorState message={t("empty")} />;
  }

  const company = job ? companies.find((c) => c.id === job.companyId) : undefined;
  const isRejected = application.stage === "rejected";
  const currentStageIndex = PIPELINE_STAGES.indexOf(application.stage);

  return (
    <div className="container mx-auto px-4 py-8">
      <CandidateNav />

      <div className="mb-6">
        <Link
          href="/candidate/applications"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t("title")}
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{t("detail.title")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>{job?.title ?? "Job"}</CardTitle>
                  <CardDescription>{company?.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {application.matchScore > 0 && (
                    <Badge variant={application.matchScore >= 50 ? "default" : "secondary"}>
                      {tMatch("matchPercent", { score: application.matchScore })}
                    </Badge>
                  )}
                  <Badge variant={isRejected ? "destructive" : "outline"}>
                    {tStages(application.stage)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {job && (
                <Link
                  href={`/jobs/${job.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {t("detail.viewJob")} →
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.timeline")}</CardTitle>
              <CardDescription>{t("detail.currentStage")}: {tStages(application.stage)}</CardDescription>
            </CardHeader>
            <CardContent>
              {isRejected ? (
                <p className="text-sm text-destructive">{tStages("rejected")}</p>
              ) : (
                <ol className="space-y-3">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const isComplete = idx < currentStageIndex;
                    const isCurrent = stage === application.stage;
                    return (
                      <li key={stage} className="flex items-center gap-3">
                        {isComplete || isCurrent ? (
                          <CheckCircle2
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isCurrent ? "text-primary" : "text-emerald-500"
                            )}
                          />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                        )}
                        <span
                          className={cn(
                            "text-sm",
                            isCurrent && "font-medium text-foreground",
                            !isComplete && !isCurrent && "text-muted-foreground"
                          )}
                        >
                          {tStages(stage)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>

          {application.matchDimensions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("detail.matchDimensions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <MatchDimensions dimensions={application.matchDimensions} />
              </CardContent>
            </Card>
          )}

          {application.notes && application.notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("detail.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {application.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {application.matchScore >= 50 && (
            <GeneralAssessmentFlow
              applicationId={application.id}
              matchScore={application.matchScore}
              existingAssessment={assessment ?? undefined}
              onComplete={(a) => setAssessment(a)}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("appliedAt", {
                date: new Date(application.appliedAt).toLocaleDateString(),
              })}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Last updated: {new Date(application.updatedAt).toLocaleDateString()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
