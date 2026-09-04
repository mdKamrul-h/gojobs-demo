"use client";

import { useTranslations } from "next-intl";
import { CompetencyCard } from "./CompetencyCard";
import type { TalentProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TalentGraphPanelProps {
  profile: TalentProfile;
}

export function TalentGraphPanel({ profile }: TalentGraphPanelProps) {
  const t = useTranslations("talent");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("graphTitle")}</CardTitle>
        <CardDescription>{t("graphDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.competencies.map((c) => (
            <CompetencyCard key={c.id} competency={c} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
