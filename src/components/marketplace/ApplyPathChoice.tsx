"use client";

import { useTranslations } from "next-intl";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApplyPathChoice() {
  const t = useTranslations("apply");
  const { role, isAuthenticated } = useDemoAuth();

  if (!isAuthenticated || role !== "candidate") return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("applyWithPassport")}</CardTitle>
        <CardDescription>{t("applyChoiceDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {t("applyAsGuest")}
      </CardContent>
    </Card>
  );
}
