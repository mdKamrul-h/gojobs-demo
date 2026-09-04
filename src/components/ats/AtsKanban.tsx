"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STAGES } from "@/lib/mock/services/employer";
import { updateApplicationStage } from "@/lib/mock/services/applications";
import { getCandidateByIdAsync } from "@/lib/mock/services/candidates";
import type { Application, ApplicationStage } from "@/lib/types";
import { AtsStageColumn } from "./AtsStageColumn";

interface AtsKanbanProps {
  jobId: string;
  applications: Application[];
  onStageChange: (appId: string, stage: ApplicationStage) => void;
  onRefresh: () => void;
}

export function AtsKanban({ jobId, applications, onStageChange, onRefresh }: AtsKanbanProps) {
  const t = useTranslations("employer.ats");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const activeApp = applications.find((a) => a.id === activeId);

  const resolveName = async (app: Application) => {
    if (names[app.id]) return names[app.id];
    if (app.guestInfo?.name) return app.guestInfo.name;
    if (app.candidateId) {
      const cand = await getCandidateByIdAsync(app.candidateId);
      if (cand) {
        setNames((prev) => ({ ...prev, [app.id]: cand.name }));
        return cand.name;
      }
    }
    return app.id;
  };

  applications.forEach((app) => {
    if (!names[app.id]) {
      resolveName(app).then((name) => {
        if (name) setNames((prev) => ({ ...prev, [app.id]: name }));
      });
    }
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const appId = String(active.id);
    const newStage = String(over.id) as ApplicationStage;
    if (!APPLICATION_STAGES.includes(newStage)) return;

    const app = applications.find((a) => a.id === appId);
    if (!app || app.stage === newStage) return;

    onStageChange(appId, newStage);
    await updateApplicationStage(appId, newStage);
    onRefresh();
  };

  const appsByStage = APPLICATION_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = applications.filter((a) => a.stage === stage);
      return acc;
    },
    {} as Record<ApplicationStage, Application[]>
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {APPLICATION_STAGES.map((stage) => (
          <AtsStageColumn
            key={stage}
            stage={stage}
            applications={appsByStage[stage]}
            jobId={jobId}
            names={names}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp ? (
          <Card className="w-[260px] shadow-lg opacity-90">
            <CardContent className="p-3">
              <p className="font-medium text-sm">{names[activeApp.id] ?? "..."}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {t(`stages.${activeApp.stage}`)}
              </Badge>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
