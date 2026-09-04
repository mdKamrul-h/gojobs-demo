"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentActivity } from "@/lib/types";

interface AgentActivityPanelProps {
  activities: AgentActivity[];
}

export function AgentActivityPanel({ activities }: AgentActivityPanelProps) {
  const t = useTranslations("agents.activity");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-md border p-3">
            <p className="text-sm">{activity.summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {format(new Date(activity.timestamp), "PP")}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
