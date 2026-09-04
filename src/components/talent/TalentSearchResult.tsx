"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TalentGraphPanel } from "./TalentGraphPanel";
import { applications } from "@/lib/mock/fixtures/applications";
import type { TalentProfile } from "@/lib/types";

interface TalentSearchResultProps {
  profile: TalentProfile;
}

function getPipelineHref(candidateId: string): string {
  const app = applications.find((a) => a.candidateId === candidateId);
  if (app) {
    return `/employer/jobs/${app.jobId}/applicants/${app.id}`;
  }
  return "/employer/jobs/job-009/applicants";
}

export function TalentSearchResult({ profile }: TalentSearchResultProps) {
  const t = useTranslations("talent");

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-semibold text-lg">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
            <p className="text-xs text-muted-foreground mt-1">{profile.location}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{t("overlap", { percent: profile.overlapPercent })}</Badge>
            <Badge variant="outline">
              {profile.salaryBand.currency} {profile.salaryBand.min / 1000}k–{profile.salaryBand.max / 1000}k
            </Badge>
          </div>
        </div>
        <TalentGraphPanel profile={profile} />
        <Link
          href={getPipelineHref(profile.candidateId)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {t("viewProfile")}
        </Link>
      </CardContent>
    </Card>
  );
}
