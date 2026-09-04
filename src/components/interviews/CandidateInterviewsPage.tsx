"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { Video, Calendar } from "lucide-react";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { InterviewScheduler } from "@/components/interviews/InterviewScheduler";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInterviewsByCandidate } from "@/lib/mock/fixtures/interviews";

export function CandidateInterviewsPage() {
  const t = useTranslations("interviews");
  const sessions = getInterviewsByCandidate("cand-001");

  return (
    <PageContainer className="space-y-8">
      <CandidateNav />
      <div>
        <h1 className="text-2xl font-bold">{t("candidateTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("candidateSubtitle")}</p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{session.jobTitle}</CardTitle>
                  <CardDescription>
                    {session.scheduledAt
                      ? format(new Date(session.scheduledAt), "PPp")
                      : t("notScheduled")}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {session.type === "ai" ? t("ai.type") : t("human.type")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.type === "ai" && session.status !== "completed" && (
                <Link
                  href={`/candidate/interviews/${session.id}`}
                  className={cn(buttonVariants())}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {t("ai.start")}
                </Link>
              )}
              {session.type === "human" && session.status === "scheduled" && (
                <>
                  <InterviewScheduler session={session} mode="candidate" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {t("human.prepareNote")}
                  </div>
                </>
              )}
              {session.status === "completed" && (
                <p className="text-sm text-muted-foreground">{t("completedNote")}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
