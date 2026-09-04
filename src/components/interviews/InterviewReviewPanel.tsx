"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InterviewSession } from "@/lib/types";

interface InterviewReviewPanelProps {
  session: InterviewSession;
}

export function InterviewReviewPanel({ session }: InterviewReviewPanelProps) {
  const t = useTranslations("interviews.review");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{session.type === "ai" ? t("aiInterview") : t("humanInterview")}</Badge>
        <Badge variant="outline">
          {t(`status.${session.status}`, { defaultValue: session.status })}
        </Badge>
        {session.scheduledAt && (
          <span className="text-sm text-muted-foreground">
            {format(new Date(session.scheduledAt), "PPp")}
          </span>
        )}
      </div>

      {session.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{session.summary}</p>
          </CardContent>
        </Card>
      )}

      {session.transcript && session.transcript.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("transcript")}</CardTitle>
            <CardDescription>{t("transcriptDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.transcript.map((entry, i) => (
              <div key={i} className="rounded-md bg-muted/50 p-3 text-sm">
                <span className="font-medium capitalize">{entry.role}: </span>
                {entry.text}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {session.scorecard && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("scorecard")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.scorecard.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span>{c.label}</span>
                <span className="text-muted-foreground">
                  {c.score !== null ? `${c.score}/${c.maxScore}` : t("notScored")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
