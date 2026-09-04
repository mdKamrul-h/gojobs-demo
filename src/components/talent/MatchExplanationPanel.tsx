"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { MatchDimensions } from "@/components/shared/MatchDimensions";
import type { MatchDimension } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchExplanationPanelProps {
  dimensions: MatchDimension[];
  summary?: string;
  overlapPercent?: number;
}

export function MatchExplanationPanel({
  dimensions,
  summary,
  overlapPercent,
}: MatchExplanationPanelProps) {
  const t = useTranslations("talent.match");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <CardDescription>
          {overlapPercent !== undefined
            ? t("overlapNote", { percent: overlapPercent })
            : t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary && (
          <p className="text-sm text-muted-foreground rounded-md bg-muted/50 p-3">{summary}</p>
        )}
        <MatchDimensions dimensions={dimensions} />
        <p className="text-xs text-muted-foreground">{t("evidenceNote")}</p>
      </CardContent>
    </Card>
  );
}
