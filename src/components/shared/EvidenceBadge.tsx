"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { EvidenceSource } from "@/lib/types";
import { cn } from "@/lib/utils";

const sourceVariants: Record<EvidenceSource, string> = {
  candidate_provided: "bg-slate-100 text-slate-700 border-slate-200",
  cv_extracted: "bg-blue-50 text-blue-700 border-blue-200",
  assessment_derived: "bg-teal-50 text-teal-700 border-teal-200",
  interview_derived: "bg-purple-50 text-purple-700 border-purple-200",
  recruiter_entered: "bg-amber-50 text-amber-700 border-amber-200",
};

interface EvidenceBadgeProps {
  source: EvidenceSource;
  className?: string;
}

export function EvidenceBadge({ source, className }: EvidenceBadgeProps) {
  const t = useTranslations("evidence");
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-normal", sourceVariants[source], className)}
    >
      {t(source)}
    </Badge>
  );
}
