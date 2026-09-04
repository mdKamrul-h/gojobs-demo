"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewSession } from "@/lib/types";

interface InterviewSchedulerProps {
  session: InterviewSession;
  mode: "employer" | "candidate";
}

export function InterviewScheduler({ session, mode }: InterviewSchedulerProps) {
  const t = useTranslations("interviews.schedule");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSchedule() {
    if (!date || !time) return;
    localStorage.setItem(
      `schedule-${session.id}`,
      JSON.stringify({ date, time, scheduledBy: mode, scheduledAt: new Date().toISOString() })
    );
    toast.success(t("scheduled"));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t(`${mode}Description`)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("date")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("time")}</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {t("duration", { minutes: session.durationMinutes })}
        </div>
        <Button onClick={handleSchedule}>{t("confirm")}</Button>
      </CardContent>
    </Card>
  );
}
