"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import type { RoleAssessment } from "@/lib/types";

interface RoleAssessmentFlowProps {
  assessment: RoleAssessment;
}

export function RoleAssessmentFlow({ assessment }: RoleAssessmentFlowProps) {
  const t = useTranslations("assessments");
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "questions" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = assessment.questions[currentQ];
  const progress = step === "questions" ? ((currentQ + 1) / assessment.questions.length) * 100 : 0;

  function handleSubmit() {
    if (currentQ < assessment.questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setStep("results");
      localStorage.setItem(`assessment-${assessment.id}`, JSON.stringify({ completedAt: new Date().toISOString(), answers }));
      toast.success(t("completed"));
    }
  }

  if (step === "intro") {
    return (
      <PageContainer>
        <CandidateNav />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription>
              {t("introDescription", { count: assessment.questionCount, minutes: assessment.durationMinutes })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStep("questions")}>{t("start")}</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (step === "results") {
    return (
      <PageContainer>
        <CandidateNav />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("results")}</CardTitle>
            <CardDescription>{t("resultsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{t("mockOutcome")}</p>
            <Button onClick={() => router.push("/candidate/applications")}>{t("backToApplications")}</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CandidateNav />
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {t("question", { current: currentQ + 1, total: assessment.questions.length })}
          </p>
          <Progress value={progress} className="h-2" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "mcq" && question.options ? (
              <div className="space-y-2">
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt }))}
                    className={cn(
                      "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50",
                      answers[question.id] === opt && "border-primary bg-primary/5"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <Textarea
                value={answers[question.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [question.id]: e.target.value }))}
                placeholder={t("shortAnswerPlaceholder")}
                rows={4}
              />
            )}
            <Button onClick={handleSubmit} disabled={!answers[question.id]}>
              {currentQ < assessment.questions.length - 1 ? t("next") : t("submit")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
