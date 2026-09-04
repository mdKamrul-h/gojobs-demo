"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { InterviewReviewPanel } from "@/components/interviews/InterviewReviewPanel";
import { InterviewScheduler } from "@/components/interviews/InterviewScheduler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInterviewsForEmployer } from "@/lib/mock/fixtures/interviews";

export function EmployerInterviewsPage() {
  const t = useTranslations("interviews");
  const sessions = getInterviewsForEmployer();

  return (
    <PageContainer className="space-y-8">
      <EmployerNav />
      <div>
        <h1 className="text-2xl font-bold">{t("employerTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("employerSubtitle")}</p>
      </div>

      <div className="space-y-6">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{session.jobTitle}</CardTitle>
                <div className="flex gap-2">
                  <Badge>{session.type === "ai" ? t("ai.type") : t("human.type")}</Badge>
                  <Badge variant="outline">{t(`status.${session.status}`)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.status === "completed" ? (
                <InterviewReviewPanel session={session} />
              ) : session.type === "human" ? (
                <InterviewScheduler session={session} mode="employer" />
              ) : (
                <p className="text-sm text-muted-foreground">{t("ai.pendingReview")}</p>
              )}
              <Link
                href={`/employer/jobs/${session.jobId}/applicants`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                {t("viewApplicant")}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
