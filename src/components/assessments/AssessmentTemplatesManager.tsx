"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { assessmentTemplates } from "@/lib/mock/fixtures/interviews";
import { toast } from "sonner";

export function AssessmentTemplatesManager() {
  const t = useTranslations("assessments.templates");
  const [templates, setTemplates] = useState(assessmentTemplates);

  function toggleTemplate(id: string) {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, enabled: !tpl.enabled } : tpl))
    );
    toast.success(t("updated"));
  }

  return (
    <PageContainer className="space-y-8">
      <EmployerNav />
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <Card key={tpl.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{tpl.name}</CardTitle>
                  <CardDescription>
                    {t("meta", { count: tpl.questionCount, minutes: tpl.durationMinutes })}
                  </CardDescription>
                </div>
                <Badge variant={tpl.enabled ? "default" : "secondary"}>
                  {tpl.enabled ? t("enabled") : t("disabled")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{tpl.occupation}</span>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={tpl.enabled}
                  onCheckedChange={() => toggleTemplate(tpl.id)}
                />
                <span className="text-sm">{t("toggle")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
