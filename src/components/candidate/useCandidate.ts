"use client";

import { useCallback, useEffect, useState } from "react";
import type { Candidate } from "@/lib/types";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import {
  createCandidateProfile,
  getCandidateByIdAsync,
  getCandidateByUserIdAsync,
} from "@/lib/mock/services/candidates";

export function useCandidate() {
  const { user, isAuthenticated, role } = useDemoAuth();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user || role !== "candidate") {
      setCandidate(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let found = await getCandidateByUserIdAsync(user.id);
      if (!found && user.candidateId) {
        found = await getCandidateByIdAsync(user.candidateId);
      }
      if (!found) {
        found = await createCandidateProfile({
          userId: user.id,
          name: user.name,
          email: user.email,
        });
      }
      setCandidate(found);
    } catch {
      setError("Failed to load candidate profile");
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (isAuthenticated && role === "candidate") {
      refresh();
    } else {
      setCandidate(null);
      setLoading(false);
    }
  }, [isAuthenticated, role, refresh]);

  return { candidate, loading, error, refresh, user };
}
