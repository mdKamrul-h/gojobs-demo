"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { MatchDimensions } from "@/components/shared/MatchDimensions";
import { useCandidate } from "@/components/candidate/useCandidate";
import type { CareerPassport, GeneralAssessment } from "@/lib/types";
import {
  generalAssessmentQuestions,
  submitGeneralAssessment,
} from "@/lib/mock/services/assessments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FlowStep = "confirm" | "questions" | "results";

interface GeneralAssessmentFlowProps {
  applicationId: string;
  matchScore: number;
  existingAssessment?: GeneralAssessment;
  onComplete?: (assessment: GeneralAssessment) => void;
}

export function GeneralAssessmentFlow({
  applicationId,
  matchScore,
  existingAssessment,
  onComplete,
}: GeneralAssessmentFlowProps) {
  const t = useTranslations("candidate.assessment");
  const tMatch = useTranslations("match");
  const { candidate } = useCandidate();
  const [step, setStep] = useState<FlowStep>(existingAssessment ? "results" : "confirm");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerIndex: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GeneralAssessment | null>(
    existingAssessment ?? null
  );

  if (matchScore < 50) return null;

  const questions = generalAssessmentQuestions.slice(0, 4);
  const currentQuestion = questions[questionIndex];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answerIndex },
    ];
    setAnswers(newAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const assessment = await submitGeneralAssessment({
      applicationId,
      answers,
    });
    setResult(assessment);
    setStep("results");
    onComplete?.(assessment);
    setSubmitting(false);
  };

  if (existingAssessment && step === "results") {
    return <AssessmentResults assessment={existingAssessment} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{tMatch("eligible")}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "confirm" && candidate && (
          <PassportConfirm
            passport={candidate.passport}
            onStart={() => setStep("questions")}
          />
        )}

        {step === "questions" && currentQuestion && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("question", {
                current: questionIndex + 1,
                total: questions.length,
              })}
            </p>
            <p className="font-medium">{currentQuestion.question}</p>
            <div className="space-y-2">
              {currentQuestion.options?.map((option, idx) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50",
                    answers.find((a) => a.questionId === currentQuestion.id)?.answerIndex === idx &&
                      "border-primary bg-primary/5"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            {answers.length === questions.length && (
              <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("submitAnswers")}
              </Button>
            )}
          </div>
        )}

        {step === "results" && result && <AssessmentResults assessment={result} />}
      </CardContent>
    </Card>
  );
}

function PassportConfirm({
  passport,
  onStart,
}: {
  passport: CareerPassport;
  onStart: () => void;
}) {
  const t = useTranslations("candidate.assessment");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("confirmPassportDescription")}</p>
      <div className="rounded-lg border p-4 space-y-2 text-sm">
        <p className="font-medium">{passport.headline}</p>
        <p className="text-muted-foreground line-clamp-2">{passport.summary}</p>
        <p className="text-muted-foreground">
          {passport.skills.slice(0, 5).map((s) => s.name).join(" · ")}
        </p>
      </div>
      <Button onClick={onStart} className="w-full">
        {t("startAssessment")}
      </Button>
    </div>
  );
}

function AssessmentResults({ assessment }: { assessment: GeneralAssessment }) {
  const t = useTranslations("candidate.assessment");
  const tMatch = useTranslations("match");

  const outcomeVariant: Record<GeneralAssessment["outcome"], string> = {
    strong_fit: "bg-emerald-100 text-emerald-800 border-emerald-200",
    moderate_fit: "bg-amber-100 text-amber-800 border-amber-200",
    limited_fit: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={outcomeVariant[assessment.outcome]}>
          {t(`outcomes.${assessment.outcome}`)}
        </Badge>
      </div>
      <p className="text-sm">{assessment.summary}</p>
      <MatchDimensions dimensions={assessment.dimensions} />
      <p className="text-xs text-muted-foreground">
        {tMatch("dimensions")} — {t("results")}
      </p>
    </div>
  );
}
