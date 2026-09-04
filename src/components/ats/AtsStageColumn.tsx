"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStage } from "@/lib/types";

interface AtsStageColumnProps {
  stage: ApplicationStage;
  applications: Application[];
  jobId: string;
  names: Record<string, string>;
}

export function AtsStageColumn({ stage, applications, jobId, names }: AtsStageColumnProps) {
  const t = useTranslations("employer.ats");
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-[260px] rounded-lg border bg-muted/30",
        isOver && "ring-2 ring-primary/50"
      )}
    >
      <div className="p-3 border-b bg-background/80 rounded-t-lg sticky top-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t(`stages.${stage}`)}</h3>
          <Badge variant="secondary" className="text-xs">
            {applications.length}
          </Badge>
        </div>
      </div>
      <div className="p-2 space-y-2 min-h-[120px] max-h-[60vh] overflow-y-auto">
        {applications.map((app) => (
          <DraggableCard key={app.id} app={app} jobId={jobId} name={names[app.id]} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({
  app,
  jobId,
  name,
}: {
  app: Application;
  jobId: string;
  name?: string;
}) {
  const t = useTranslations("employer.ats");
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-50")}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-3 space-y-2">
        <Link
          href={`/employer/jobs/${jobId}/applicants/${app.id}`}
          className="font-medium text-sm hover:underline block"
          onClick={(e) => e.stopPropagation()}
        >
          {name ?? "..."}
        </Link>
        {app.matchDimensions.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("dimensionCount", { count: app.matchDimensions.length })}
          </p>
        )}
        {app.matchScore > 0 && (
          <Badge variant="outline" className="text-xs">
            {t("overlap", { percent: app.matchScore })}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
