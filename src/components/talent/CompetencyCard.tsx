"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import type { TalentCompetency } from "@/lib/types";
import { cn } from "@/lib/utils";

const confidenceColors = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-orange-400",
};

interface CompetencyCardProps {
  competency: TalentCompetency;
  className?: string;
}

export function CompetencyCard({ competency, className }: CompetencyCardProps) {
  const t = useTranslations("talent");

  const confidenceValue = { high: 90, medium: 60, low: 35 }[competency.confidence];

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{competency.name}</p>
          <p className="text-xs text-muted-foreground">{competency.category}</p>
        </div>
        <EvidenceBadge source={competency.evidence} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t("confidence")}</span>
          <span>{t(`confidenceLevel.${competency.confidence}`)}</span>
        </div>
        <Progress
          value={confidenceValue}
          className={cn("h-1.5", `[&>[data-slot=progress-indicator]]:${confidenceColors[competency.confidence]}`)}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("recency", { months: competency.recencyMonths })}</span>
        <Badge variant="outline" className="text-xs font-normal">
          {competency.evidenceDetail}
        </Badge>
      </div>
    </div>
  );
}
