"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Users, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { MatchDimensions } from "@/components/shared/MatchDimensions";
import { getEmployerJobById } from "@/lib/mock/services/employer";
import { getApplicationsByJobIdAsync } from "@/lib/mock/services/applications";
import { isGeneralAssessmentEligible } from "@/lib/utils/format";
import type { Application, Job } from "@/lib/types";

interface JobDetailViewProps {
  jobId: string;
  locale: string;
}

export function JobDetailView({ jobId, locale }: JobDetailViewProps) {
  const t = useTranslations("employer.jobDetail");
  const [job, setJob] = useState<Job | null>(null);
  const [stats, setStats] = useState({ total: 0, matched50: 0, inPipeline: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const j = await getEmployerJobById(jobId);
      setJob(j ?? null);
      if (j) {
        const apps = await getApplicationsByJobIdAsync(j.id);
        const active = apps.filter((a) => a.stage !== "rejected");
        setStats({
          total: active.length,
          matched50: active.filter((a) => isGeneralAssessmentEligible(a.matchScore)).length,
          inPipeline: active.filter((a) => !["hired", "offer"].includes(a.stage)).length,
        });
      }
      setLoading(false);
    }
    load();
  }, [jobId]);

  if (loading) return <LoadingState />;
  if (!job) {
    return (
      <div className="container py-12 text-center text-muted-foreground">{t("notFound")}</div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={job.status === "published" ? "default" : "secondary"}>
              {t(`status.${job.status}`)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="text-muted-foreground mt-1">{job.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/employer/jobs/${job.id}/applicants`} className={buttonVariants()}>
            <Users className="h-4 w-4 mr-2" />
            {t("viewApplicants")}
          </Link>
          {job.slug && (
            <Link
              href={`/jobs/${job.slug}`}
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("publicListing")}
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t("stats.totalApplicants")} value={stats.total} />
        <StatCard label={t("stats.matched50")} value={stats.matched50} />
        <StatCard label={t("stats.inPipeline")} value={stats.inPipeline} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("overview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("salary")}</span>
              <SalaryDisplay salary={job.salary} locale={locale} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("workMode")}</span>
              <span>{t(`workModes.${job.workMode}`)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("responsibilities")}</span>
              <ul className="list-disc list-inside mt-1">
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("requirements")}</CardTitle>
            <CardDescription>{t("requirementsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchDimensions
              dimensions={[
                ...job.hardRequirements.map((r) => ({
                  label: r.label,
                  level: "strong" as const,
                  evidence: "recruiter_entered" as const,
                })),
                ...job.softRequirements.map((r) => ({
                  label: r.label,
                  level: "moderate" as const,
                  evidence: "recruiter_entered" as const,
                })),
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
