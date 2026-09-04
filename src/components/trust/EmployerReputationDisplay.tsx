"use client";

import { useTranslations } from "next-intl";
import { Star, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustIndicator } from "@/components/shared/TrustIndicator";
import type { TrustStatus } from "@/lib/types";

interface EmployerReputationDisplayProps {
  companyName: string;
  trustStatus: TrustStatus;
  jobsPosted: number;
  responseRate: number;
  avgReviewDays: number;
  flags?: string[];
}

export function EmployerReputationDisplay({
  companyName,
  trustStatus,
  jobsPosted,
  responseRate,
  avgReviewDays,
  flags = [],
}: EmployerReputationDisplayProps) {
  const t = useTranslations("trust.reputation");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <CardDescription>{companyName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TrustIndicator status={trustStatus} />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums">{jobsPosted}</p>
            <p className="text-xs text-muted-foreground">{t("jobsPosted")}</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">{responseRate}%</p>
            <p className="text-xs text-muted-foreground">{t("responseRate")}</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">{avgReviewDays}d</p>
            <p className="text-xs text-muted-foreground">{t("avgReview")}</p>
          </div>
        </div>
        {flags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <Badge key={flag} variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                {t(`flags.${flag}`)}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{t("employerChecksNote")}</p>
      </CardContent>
    </Card>
  );
}
