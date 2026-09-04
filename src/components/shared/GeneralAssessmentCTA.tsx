"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isGeneralAssessmentEligible } from "@/lib/utils/format";

interface GeneralAssessmentCTAProps {
  matchScore: number;
  onAssess?: () => void;
  className?: string;
}

export function GeneralAssessmentCTA({
  matchScore,
  onAssess,
  className,
}: GeneralAssessmentCTAProps) {
  const t = useTranslations("match");

  if (!isGeneralAssessmentEligible(matchScore)) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <CardTitle className="text-base">General Assessment</CardTitle>
        </div>
        <CardDescription>{t("eligible")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onAssess} className="w-full sm:w-auto">
          {t("assessFit")}
        </Button>
      </CardContent>
    </Card>
  );
}
