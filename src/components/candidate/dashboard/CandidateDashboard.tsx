"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ClipboardList,
  Bookmark,
  UserCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getApplicationsByCandidateIdAsync } from "@/lib/mock/services/applications";
import { getRecommendedJobs, type RecommendedJob } from "@/lib/mock/services/candidates";
import { companies } from "@/lib/mock/fixtures/companies";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import { getMissingPassportFields } from "@/lib/utils/passport-gaps";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";

export function CandidateDashboard() {
  const t = useTranslations("candidate.dashboard");
  const tMatch = useTranslations("match");
  const locale = useLocale();
  const { candidate, loading } = useCandidate();
  const [activeApps, setActiveApps] = useState(0);
  const [recommended, setRecommended] = useState<RecommendedJob[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    if (!candidate) return;
    async function load() {
      setLoadingExtras(true);
      const [apps, recs] = await Promise.all([
        getApplicationsByCandidateIdAsync(candidate!.id),
        getRecommendedJobs(candidate!.id, 5),
      ]);
      setActiveApps(
        apps.filter((a) => a.stage !== "rejected" && a.stage !== "hired").length
      );
      setRecommended(recs);
      setLoadingExtras(false);
    }
    load();
  }, [candidate]);

  if (loading || !candidate) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  const completeness = candidate.passport.completeness;
  const missingFields = getMissingPassportFields(candidate.passport);

  return (
    <div className="container mx-auto px-4 py-8">
      <CandidateNav />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("welcome", { name: candidate.name })}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link href="/candidate/applications" className="block">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.applications")}
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loadingExtras ? "—" : activeApps}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/candidate/passport" className="block">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.completeness")}
              </CardTitle>
              <UserCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completeness}%</p>
              <Progress value={completeness} className="mt-2 h-2" />
              {missingFields.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  {missingFields.map((field) => (
                    <li key={field}>{t(`missing.${field}`)}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/candidate/saved" className="block">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.saved")}
              </CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{candidate.savedJobIds.length}</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("recommended")}</CardTitle>
              <CardDescription>{t("recommendedSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingExtras ? (
                <LoadingState />
              ) : recommended.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("recommendedSubtitle")}</p>
              ) : (
                recommended.map(({ job, matchScore }) => {
                  const company = companies.find((c) => c.id === job.companyId);
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.slug}`}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{job.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {company?.name ?? "Company"}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          <SalaryDisplay salary={job.salary} locale={locale} />
                          {" · "}
                          {getLocationDisplay(job.location, locale).full}
                        </p>
                      </div>
                      <Badge
                        variant={matchScore >= 50 ? "default" : "secondary"}
                        className="ml-3 shrink-0"
                      >
                        {tMatch("matchPercent", { score: matchScore })}
                      </Badge>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/candidate/passport">
                <Button variant="outline" className="w-full justify-between">
                  {t("editPassport")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/candidate/applications">
                <Button variant="outline" className="w-full justify-between">
                  {t("viewApplications")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {completeness < 80 && (
                <Link href="/candidate/onboarding">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {t("completeOnboarding")}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
