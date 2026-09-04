"use client";

import { useTranslations } from "next-intl";
import { Calendar, ClipboardCheck, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STAGES } from "@/lib/mock/services/employer";
import type { Application, ApplicationStage } from "@/lib/types";

interface CandidateReviewActionsPanelProps {
  application: Application;
  saving: boolean;
  note: string;
  onNoteChange: (value: string) => void;
  onStageChange: (stage: ApplicationStage) => void;
  onAddNote: () => void;
}

export function CandidateReviewActionsPanel({
  application,
  saving,
  note,
  onNoteChange,
  onStageChange,
  onAddNote,
}: CandidateReviewActionsPanelProps) {
  const t = useTranslations("employer.review");
  const tc = useTranslations("common");

  const allNotes = [
    ...(application.recruiterNotes ?? []).map((n) => n.text),
    ...(application.notes ?? []),
  ];

  return (
    <aside className="space-y-4 lg:w-64 xl:w-72 shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("actions")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("moveStage")}</label>
            <Select
              value={application.stage}
              onValueChange={(v) => onStageChange(v as ApplicationStage)}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {t(`stages.${stage}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => toast.info(t("inviteAssessmentMock"))}
          >
            <ClipboardCheck className="h-4 w-4" />
            {t("inviteAssessment")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => toast.info(t("scheduleInterviewMock"))}
          >
            <Calendar className="h-4 w-4" />
            {t("scheduleInterview")}
          </Button>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <StickyNote className="h-3 w-3" />
              {t("addNote")}
            </label>
            <Textarea value={note} onChange={(e) => onNoteChange(e.target.value)} rows={3} />
            <Button size="sm" onClick={onAddNote} disabled={saving || !note.trim()} className="w-full">
              {tc("save")}
            </Button>
          </div>

          {allNotes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t("existingNotes")}</p>
              {allNotes.map((n, i) => (
                <p key={i} className="text-sm bg-muted rounded p-2">
                  {n}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
