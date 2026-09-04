"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  CheckCircle2,
  Circle,
  Clock,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchDimensions } from "@/components/shared/MatchDimensions";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { CompetencyCard } from "@/components/talent/CompetencyCard";
import type {
  Application,
  Candidate,
  GeneralAssessment,
  Job,
  SalaryRange,
} from "@/lib/types";

interface CandidateReviewTabsProps {
  application: Application;
  candidate: Candidate | null;
  job: Job;
  assessment: GeneralAssessment | null;
  candidateName: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function resolveSalary(
  application: Application,
  candidate: Candidate | null
): SalaryRange | undefined {
  return (
    application.guestInfo?.salaryExpectation ??
    candidate?.passport.preferences.salaryExpectation
  );
}

export function CandidateReviewTabs({
  application,
  candidate,
  job,
  assessment,
  candidateName,
}: CandidateReviewTabsProps) {
  const t = useTranslations("employer.review");
  const locale = useLocale();
  const screeningMap = new Map(job.screeningQuestions.map((q) => [q.id, q.question]));

  const headline =
    candidate?.passport.headline ?? application.guestInfo?.headline ?? t("noHeadline");
  const email = candidate?.passport.email ?? application.guestInfo?.email;
  const phone = candidate?.passport.phone ?? application.guestInfo?.phone;
  const location =
    application.location ??
    application.guestInfo?.location ??
    candidate?.passport.preferences.preferredLocations[0]?.districtId?.replace(/-/g, " ");
  const noticePeriod =
    application.guestInfo?.noticePeriod ??
    (candidate?.passport.preferences.noticePeriodDays
      ? `${candidate.passport.preferences.noticePeriodDays} ${t("days")}`
      : undefined);
  const availability = application.availability ?? application.guestInfo?.availability;
  const salary = resolveSalary(application, candidate);

  const activityEvents =
    application.activityLog && application.activityLog.length > 0
      ? [...application.activityLog].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      : buildFallbackTimeline(application, assessment, {
          applied: t("timeline.applied"),
          stageChanged: (stage) => t("timeline.stageChanged", { stage }),
          assessmentCompleted: t("timeline.assessmentCompleted"),
          stageLabel: (stage) => t(`stages.${stage}`),
        });

  const allEvidence = [
    ...application.matchDimensions,
    ...(assessment?.dimensions ?? []),
    ...(application.competencies?.map((c) => ({
      label: c.name,
      level: c.confidence === "high" ? ("strong" as const) : c.confidence === "medium" ? ("moderate" as const) : ("limited" as const),
      evidence: c.evidence,
    })) ?? []),
  ];

  return (
    <Tabs defaultValue="overview" className="min-w-0 flex-1">
      <TabsList className="w-full flex-wrap h-auto gap-1">
        <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
        <TabsTrigger value="application">{t("tabs.application")}</TabsTrigger>
        <TabsTrigger value="match">{t("tabs.match")}</TabsTrigger>
        <TabsTrigger value="assessments">{t("tabs.assessments")}</TabsTrigger>
        <TabsTrigger value="evidence">{t("tabs.evidence")}</TabsTrigger>
        <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials(candidateName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2 min-w-0">
                <div>
                  <p className="font-semibold text-lg">{candidateName}</p>
                  <p className="text-muted-foreground">{headline}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {email}
                    </span>
                  )}
                  {phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {phone}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                  )}
                </div>
                {!candidate && application.guestInfo && (
                  <Badge variant="outline">{t("guestApplicant")}</Badge>
                )}
                {candidate && (
                  <Badge variant="secondary">
                    {t("completeness", { percent: candidate.passport.completeness })}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("applicationSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("appliedDate")}</span>
                <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("source")}</span>
                <span>{t(`sources.${application.source ?? "gojobs"}`)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("currentStage")}</span>
                <span>{t(`stages.${application.stage}`)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("expectations")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {salary && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{t("salaryExpectation")}</span>
                  <SalaryDisplay salary={salary} locale={locale} />
                </div>
              )}
              {noticePeriod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("noticePeriod")}</span>
                  <span>{noticePeriod}</span>
                </div>
              )}
              {availability && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("availability")}</span>
                  <span>{availability}</span>
                </div>
              )}
              {location && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("location")}</span>
                  <span>{location}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {application.matchDimensions.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("quickMatch")}</CardTitle>
              <CardDescription>{t("dimensionalMatchDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <MatchDimensions dimensions={application.matchDimensions.slice(0, 4)} />
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="application" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("screeningAnswers")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.screeningAnswers.map((sa) => (
              <div key={sa.questionId}>
                <p className="text-xs text-muted-foreground">
                  {screeningMap.get(sa.questionId) ?? sa.questionId}
                </p>
                <p className="mt-1">{sa.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {application.guestInfo?.coverNote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("coverNote")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic text-muted-foreground">{application.guestInfo.coverNote}</p>
            </CardContent>
          </Card>
        )}

        {application.consentTimestamp && (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              {t("consentRecorded", {
                date: new Date(application.consentTimestamp).toLocaleString(),
              })}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="match" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("dimensionalMatch")}</CardTitle>
            <CardDescription>{t("dimensionalMatchDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {application.matchDimensions.length > 0 ? (
              <MatchDimensions dimensions={application.matchDimensions} />
            ) : (
              <p className="text-sm text-muted-foreground">{t("noDimensions")}</p>
            )}
          </CardContent>
        </Card>

        {application.matchExplanation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("matchExplanation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {application.matchExplanation}
              </p>
            </CardContent>
          </Card>
        )}

        {(application.metRequirements?.length || application.unmetRequirements?.length) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {application.metRequirements && application.metRequirements.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {t("metRequirements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {application.metRequirements.map((req) => (
                      <li key={req} className="text-sm flex items-start gap-2">
                        <Circle className="h-3 w-3 mt-1 fill-emerald-500 text-emerald-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {application.unmetRequirements && application.unmetRequirements.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-600" />
                    {t("unmetRequirements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {application.unmetRequirements.map((req) => (
                      <li key={req} className="text-sm flex items-start gap-2">
                        <Circle className="h-3 w-3 mt-1 fill-amber-400 text-amber-400 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="assessments" className="mt-4 space-y-4">
        {assessment ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("gaResults")}</CardTitle>
                <CardDescription>
                  {t(`outcomes.${assessment.outcome}`)} ·{" "}
                  {new Date(assessment.completedAt).toLocaleDateString()}
                  {assessment.durationMinutes
                    ? ` · ${t("duration", { minutes: assessment.durationMinutes })}`
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{assessment.summary}</p>
                <MatchDimensions dimensions={assessment.dimensions} />
              </CardContent>
            </Card>

            {assessment.questions && assessment.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("gaQuestions")}</CardTitle>
                  <CardDescription>{t("gaQuestionsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessment.questions.map((qa, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-2">
                      <p className="text-sm font-medium">
                        {i + 1}. {qa.question}
                      </p>
                      <p className="text-sm text-muted-foreground pl-4 border-l-2">{qa.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {assessment.roleAssessments?.map((ra) => (
              <Card key={ra.id}>
                <CardHeader>
                  <CardTitle className="text-base">{ra.title}</CardTitle>
                  <CardDescription>
                    {t(`roleAssessmentType.${ra.type}`)} ·{" "}
                    {new Date(ra.completedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ra.questions.map((qa, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{qa.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{qa.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              {t("noAssessment")}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="evidence" className="mt-4 space-y-4">
        {application.competencies && application.competencies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("talentGraph")}</CardTitle>
              <CardDescription>{t("talentGraphDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {application.competencies.map((c) => (
                  <CompetencyCard key={c.id} competency={c} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {application.documents && application.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("uploadedDocuments")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("uploadedAt", { date: new Date(doc.uploadedAt).toLocaleDateString() })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-normal shrink-0">
                    {t("candidateProvidedDisclaimer")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {application.portfolioLinks && application.portfolioLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("portfolio")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.portfolioLinks.map((link) => (
                <p key={link} className="text-sm text-primary truncate">
                  {link}
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        {allEvidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("evidence")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Array.from(new Set(allEvidence.map((d) => d.evidence))).map((source) => (
                <EvidenceBadge key={source} source={source} />
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="activity" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("activityTimeline")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {activityEvents.map((event) => (
                <li key={event.id ?? event.label} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p>{event.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {(application.recruiterNotes?.length || application.notes?.length) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("existingNotes")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.recruiterNotes?.map((n) => (
                <div key={n.id} className="rounded-lg bg-muted p-3 text-sm">
                  <p>{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.author ? `${n.author} · ` : ""}
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {application.notes?.map((n, i) => (
                <div key={`legacy-${i}`} className="rounded-lg bg-muted p-3 text-sm">
                  {n}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}

type TimelineEvent = {
  id?: string;
  label: string;
  timestamp: string;
};

function buildFallbackTimeline(
  application: Application,
  assessment: GeneralAssessment | null,
  labels: {
    applied: string;
    stageChanged: (stage: string) => string;
    assessmentCompleted: string;
    stageLabel: (stage: Application["stage"]) => string;
  }
): TimelineEvent[] {
  return [
    {
      id: "applied",
      label: labels.applied,
      timestamp: application.appliedAt,
    },
    ...(application.stage !== "applied"
      ? [
          {
            id: "stage",
            label: labels.stageChanged(labels.stageLabel(application.stage)),
            timestamp: application.updatedAt,
          },
        ]
      : []),
    ...(assessment
      ? [
          {
            id: "ga",
            label: labels.assessmentCompleted,
            timestamp: assessment.completedAt,
          },
        ]
      : []),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
