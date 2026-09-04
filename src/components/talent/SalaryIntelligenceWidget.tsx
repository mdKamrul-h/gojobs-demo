"use client";

import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SalaryBenchmark } from "@/lib/types";
import { formatSalaryRange } from "@/lib/utils/format";

interface SalaryIntelligenceWidgetProps {
  benchmark: SalaryBenchmark;
}

export function SalaryIntelligenceWidget({ benchmark }: SalaryIntelligenceWidgetProps) {
  const t = useTranslations("talent.salary");

  const range = { min: benchmark.p25, max: benchmark.p75, currency: benchmark.currency, period: "monthly" as const };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description", { count: benchmark.sampleSize })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">{t("p25")}</p>
            <p className="font-semibold tabular-nums">{formatSalaryRange({ ...range, min: benchmark.p25, max: benchmark.p25 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("median")}</p>
            <p className="font-semibold tabular-nums text-primary">{formatSalaryRange({ ...range, min: benchmark.p50, max: benchmark.p50 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("p75")}</p>
            <p className="font-semibold tabular-nums">{formatSalaryRange({ ...range, min: benchmark.p75, max: benchmark.p75 })}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t("updated", { date: benchmark.updatedAt })}</p>
      </CardContent>
    </Card>
  );
}
