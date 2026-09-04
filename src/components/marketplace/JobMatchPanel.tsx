"use client";

import { useEffect, useState } from "react";
import { GeneralAssessmentCTA } from "@/components/shared";
import { MatchExplanationPanel } from "@/components/talent/MatchExplanationPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { getMatchExplanation } from "@/lib/mock/services/match";
import type { MatchDimension } from "@/lib/types";

interface JobMatchPanelProps {
  jobId: string;
}

export function JobMatchPanel({ jobId }: JobMatchPanelProps) {
  const { role, user, isAuthenticated } = useDemoAuth();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [dimensions, setDimensions] = useState<MatchDimension[]>([]);

  useEffect(() => {
    if (role !== "candidate" || !isAuthenticated || !user?.candidateId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    getMatchExplanation(user.candidateId, jobId).then((result) => {
      if (!cancelled) {
        setScore(result.score);
        setDimensions(result.dimensions);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [role, isAuthenticated, user?.candidateId, jobId]);

  if (role !== "candidate" || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (dimensions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <MatchExplanationPanel dimensions={dimensions} overlapPercent={score} />
      <GeneralAssessmentCTA matchScore={score} />
    </div>
  );
}
