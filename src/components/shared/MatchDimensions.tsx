"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import type { MatchDimension, MatchLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "./EvidenceBadge";

const levelValues: Record<MatchLevel, number> = {
  strong: 100,
  moderate: 65,
  limited: 35,
  none: 0,
};

const levelColors: Record<MatchLevel, string> = {
  strong: "[&>[data-slot=progress-indicator]]:bg-emerald-500",
  moderate: "[&>[data-slot=progress-indicator]]:bg-amber-500",
  limited: "[&>[data-slot=progress-indicator]]:bg-orange-400",
  none: "[&>[data-slot=progress-indicator]]:bg-slate-300",
};

interface MatchDimensionsProps {
  dimensions: MatchDimension[];
  className?: string;
}

export function MatchDimensions({ dimensions, className }: MatchDimensionsProps) {
  const t = useTranslations("match");

  if (dimensions.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold text-foreground">{t("dimensions")}</h3>
      <div className="space-y-3">
        {dimensions.map((dim) => (
          <div key={dim.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-foreground">{dim.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t(dim.level)}</span>
                <EvidenceBadge source={dim.evidence} />
              </div>
            </div>
            <Progress
              value={levelValues[dim.level]}
              className={cn("h-2", levelColors[dim.level])}
            />
            {dim.description && (
              <p className="text-xs text-muted-foreground">{dim.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
