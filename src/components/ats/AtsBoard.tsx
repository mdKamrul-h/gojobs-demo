"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/shared/LoadingState";
import { AtsKanban } from "./AtsKanban";
import { AtsTable } from "./AtsTable";
import { getEmployerJobById, APPLICATION_STAGES } from "@/lib/mock/services/employer";
import { getApplicationsByJobIdAsync } from "@/lib/mock/services/applications";
import type { Application, ApplicationStage, Job } from "@/lib/types";

interface AtsBoardProps {
  jobId: string;
  locale: string;
}

function subscribeLg(onChange: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getLgSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function AtsBoard({ jobId, locale }: AtsBoardProps) {
  const t = useTranslations("employer.ats");
  const searchParams = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const isLg = useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
  const [viewOverride, setViewOverride] = useState<"kanban" | "table" | null>(null);
  const view = viewOverride ?? (isLg ? "kanban" : "table");
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all");
  const [matchThreshold, setMatchThreshold] = useState<number>(() => {
    const match = Number(searchParams.get("match") ?? 0);
    return Number.isFinite(match) ? match : 0;
  });

  const loadData = async () => {
    const j = await getEmployerJobById(jobId);
    const apps = await getApplicationsByJobIdAsync(jobId);
    setJob(j ?? null);
    setApplications(apps.filter((a) => a.stage !== "rejected"));
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const j = await getEmployerJobById(jobId);
      const apps = await getApplicationsByJobIdAsync(jobId);
      if (cancelled) return;
      setJob(j ?? null);
      setApplications(apps.filter((a) => a.stage !== "rejected"));
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (stageFilter !== "all" && app.stage !== stageFilter) return false;
      if (matchThreshold > 0 && app.matchScore < matchThreshold) return false;
      return true;
    });
  }, [applications, stageFilter, matchThreshold]);

  const handleStageChange = (appId: string, stage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, stage, updatedAt: new Date().toISOString() } : a
      )
    );
  };

  if (loading) return <LoadingState />;
  if (!job) {
    return (
      <div className="container py-12 text-center text-muted-foreground">{t("jobNotFound")}</div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={`/employer/jobs/${jobId}`} className="text-sm text-muted-foreground hover:underline">
            ← {job.title}
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle", { count: filtered.length })}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewOverride("kanban")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            {t("kanban")}
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewOverride("table")}
          >
            <Table2 className="h-4 w-4 mr-1" />
            {t("table")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("filterStage")}</label>
            <Select
              value={stageFilter}
              onValueChange={(v) => setStageFilter(v as ApplicationStage | "all")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStages")}</SelectItem>
                {APPLICATION_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {t(`stages.${stage}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("filterMatch")}</label>
            <Select
              value={String(matchThreshold)}
              onValueChange={(v) => setMatchThreshold(Number(v))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("matchAll")}</SelectItem>
                <SelectItem value="50">{t("match50")}</SelectItem>
                <SelectItem value="70">{t("match70")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {viewOverride === null ? (
        <>
          <div className="hidden lg:block">
            <AtsKanban
              jobId={jobId}
              applications={filtered}
              onStageChange={handleStageChange}
              onRefresh={loadData}
            />
          </div>
          <div className="lg:hidden">
            <AtsTable jobId={jobId} applications={filtered} locale={locale} onRefresh={loadData} />
          </div>
        </>
      ) : viewOverride === "kanban" ? (
        <AtsKanban
          jobId={jobId}
          applications={filtered}
          onStageChange={handleStageChange}
          onRefresh={loadData}
        />
      ) : (
        <AtsTable jobId={jobId} applications={filtered} locale={locale} onRefresh={loadData} />
      )}
    </div>
  );
}
