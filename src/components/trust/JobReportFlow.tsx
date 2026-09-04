"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobReportFlowProps {
  jobId: string;
  jobTitle: string;
}

export function JobReportFlow({ jobId, jobTitle }: JobReportFlowProps) {
  const t = useTranslations("trust.report");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);

  function handleSubmit() {
    if (!reason) return;
    localStorage.setItem(
      `job-report-${jobId}`,
      JSON.stringify({ reason, details, reportedAt: new Date().toISOString() })
    );
    toast.success(t("submitted"));
    setOpen(false);
    setReason("");
    setDetails("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Flag className="h-4 w-4 mr-2" />
        {t("reportJob")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description", { job: jobTitle })}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("reason")}</Label>
            <Select value={reason} onValueChange={(v) => setReason(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectReason")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scam">{t("reasons.scam")}</SelectItem>
                <SelectItem value="misleading_salary">{t("reasons.misleadingSalary")}</SelectItem>
                <SelectItem value="fake_company">{t("reasons.fakeCompany")}</SelectItem>
                <SelectItem value="other">{t("reasons.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("details")}</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t("detailsPlaceholder")}
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!reason}>
            {t("submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScamWarningBanner({ variant = "warning" }: { variant?: "warning" | "blocked" }) {
  const t = useTranslations("trust.scam");

  return (
    <div
      className={
        variant === "blocked"
          ? "rounded-lg border border-destructive/50 bg-destructive/10 p-4"
          : "rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      }
    >
      <div className="flex gap-3">
        <AlertTriangle
          className={
            variant === "blocked" ? "h-5 w-5 text-destructive shrink-0" : "h-5 w-5 text-amber-600 shrink-0"
          }
        />
        <div>
          <p className="font-medium text-sm">
            {variant === "blocked" ? t("blockedTitle") : t("warningTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {variant === "blocked" ? t("blockedDescription") : t("warningDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
