"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Briefcase, Plus, Users, ClipboardCheck, Star, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { LoadingState } from "@/components/shared/LoadingState";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { getEmployerJobs } from "@/lib/mock/services/employer";
import { getApplicationsByJobIdAsync } from "@/lib/mock/services/applications";
import { getAssessmentByApplicationIdAsync } from "@/lib/mock/services/assessments";
import { isGeneralAssessmentEligible } from "@/lib/utils/format";
import type { Application, Job } from "@/lib/types";

interface FunnelStats {
  total: number;
  matched50: number;
  assessmentsDone: number;
  recommended: number;
}

export function EmployerDashboard({ locale }: { locale: string }) {
  const t = useTranslations("employer.dashboard");
  const { user } = useDemoAuth();
  const companyId = user?.companyId ?? "comp-bkash";
  const [jobs, setJobs] = useState<Job[]>([]);
  const [funnel, setFunnel] = useState<FunnelStats>({
    total: 0,
    matched50: 0,
    assessmentsDone: 0,
    recommended: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const employerJobs = await getEmployerJobs(companyId);
      const openJobs = employerJobs.filter((j) => j.status === "published");
      setJobs(openJobs);

      const allApps: Application[] = [];
      for (const job of openJobs) {
        const apps = await getApplicationsByJobIdAsync(job.id);
        allApps.push(...apps.filter((a) => a.stage !== "rejected"));
      }

      const assessmentStages = new Set([
        "general_assessment",
        "ai_interview",
        "human_interview",
        "employer_checks",
        "offer",
        "hired",
      ]);

      let recommended = 0;
      for (const app of allApps) {
        const ga = await getAssessmentByApplicationIdAsync(app.id);
        if (ga && (ga.outcome === "strong_fit" || ga.outcome === "moderate_fit")) {
          recommended++;
        }
      }

      setFunnel({
        total: allApps.length,
        matched50: allApps.filter((a) => isGeneralAssessmentEligible(a.matchScore)).length,
        assessmentsDone: allApps.filter((a) => assessmentStages.has(a.stage)).length,
        recommended,
      });
      setLoading(false);
    }
    load();
  }, [companyId]);

  if (loading) return <LoadingState />;

  return (
    <div className="container py-8 space-y-8">
      <EmployerNav />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/employer/jobs/new" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" />
            {t("postJob")}
          </Link>
          <Link href="/employer/onboarding" className={buttonVariants({ variant: "outline" })}>
            {t("companySettings")}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FunnelCard icon={Users} label={t("funnel.total")} value={funnel.total} />
        <FunnelCard icon={TrendingUp} label={t("funnel.matched50")} value={funnel.matched50} />
        <FunnelCard
          icon={ClipboardCheck}
          label={t("funnel.assessmentsDone")}
          value={funnel.assessmentsDone}
        />
        <FunnelCard icon={Star} label={t("funnel.recommended")} value={funnel.recommended} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t("openJobs")}
          </CardTitle>
          <CardDescription>{t("openJobsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("noJobs")}</p>
          ) : (
            <div className="divide-y">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} locale={locale} applicantCount={job.applicantCount ?? 0} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FunnelCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobRow({
  job,
  locale,
  applicantCount,
}: {
  job: Job;
  locale: string;
  applicantCount: number;
}) {
  const t = useTranslations("employer.dashboard");

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link
          href={`/employer/jobs/${job.id}`}
          className="font-medium hover:underline"
        >
          {job.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
          <SalaryDisplay salary={job.salary} locale={locale} />
          <Badge variant="secondary">{t(`workMode.${job.workMode}`)}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {t("applicants", { count: applicantCount })}
        </span>
        <Link
          href={`/employer/jobs/${job.id}/applicants`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {t("viewApplicants")}
        </Link>
      </div>
    </div>
  );
}
