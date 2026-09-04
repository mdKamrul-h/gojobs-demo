"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplySuccessViewProps {
  referenceId: string;
  jobTitle: string;
  jobSlug: string;
}

export function ApplySuccessView({
  referenceId,
  jobTitle,
  jobSlug,
}: ApplySuccessViewProps) {
  const t = useTranslations("apply");

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">{t("successTitle")}</CardTitle>
          <CardDescription>{t("successDesc", { job: jobTitle })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{t("referenceId")}</p>
            <p className="mt-1 font-mono text-lg font-semibold">{referenceId}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t("successNote")}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button>{t("createAccount")}</Button>
            </Link>
            <Link href={`/jobs/${jobSlug}`}>
              <Button variant="outline">{t("backToJob")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
