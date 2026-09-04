"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Mic, Video, CheckCircle2, Monitor } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewSession } from "@/lib/types";

interface AiInterviewFlowProps {
  session: InterviewSession;
}

type Step = "device" | "interview" | "complete";

export function AiInterviewFlow({ session }: AiInterviewFlowProps) {
  const t = useTranslations("interviews.ai");
  const router = useRouter();
  const [step, setStep] = useState<Step>("device");
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [answer, setAnswer] = useState("");

  const question = session.questions[currentQ];
  const progress = session.questions.length > 0 ? ((currentQ + 1) / session.questions.length) * 100 : 0;

  function handleSubmitAnswer() {
    if (!answer.trim()) return;
    const entry = { role: "candidate", text: answer };
    setTranscript((prev) => [...prev, entry]);
    setAnswer("");
    if (currentQ < session.questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      localStorage.setItem(`interview-${session.id}`, JSON.stringify({ transcript, completedAt: new Date().toISOString() }));
      setStep("complete");
    }
  }

  if (step === "device") {
    return (
      <PageContainer>
        <CandidateNav />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("deviceCheck")}</CardTitle>
            <CardDescription>{t("deviceCheckDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <DeviceCheckItem icon={Mic} label={t("microphone")} ok />
              <DeviceCheckItem icon={Video} label={t("camera")} ok />
              <DeviceCheckItem icon={Monitor} label={t("browser")} ok />
            </div>
            <Button onClick={() => setStep("interview")}>{t("startInterview")}</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (step === "complete") {
    return (
      <PageContainer>
        <CandidateNav />
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-8 space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="text-xl font-bold">{t("complete")}</h2>
            <p className="text-muted-foreground">{t("completeDescription")}</p>
            <Button onClick={() => router.push("/candidate/interviews")}>{t("backToInterviews")}</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CandidateNav />
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">{session.jobTitle}</p>
          <Progress value={progress} className="mt-2 h-2" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("question")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{question?.text}</p>
              <Textarea
                className="mt-4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t("answerPlaceholder")}
                rows={4}
              />
              <Button className="mt-4" onClick={handleSubmitAnswer}>
                {currentQ < session.questions.length - 1 ? t("nextQuestion") : t("finish")}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("transcript")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {transcript.map((entry, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium capitalize">{entry.role}: </span>
                  {entry.text}
                </div>
              ))}
              {transcript.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("transcriptEmpty")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function DeviceCheckItem({
  icon: Icon,
  label,
  ok,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  ok: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
      <Icon className="h-6 w-6" />
      <span className="text-sm">{label}</span>
      {ok && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
    </div>
  );
}
