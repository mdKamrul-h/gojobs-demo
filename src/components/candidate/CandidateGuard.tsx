"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { LoadingState } from "@/components/shared/LoadingState";

export function CandidateGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, role } = useDemoAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && (!isAuthenticated || role !== "candidate")) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, role, router]);

  if (!ready || !isAuthenticated || role !== "candidate") {
    return <LoadingState className="min-h-[50vh]" />;
  }

  return <>{children}</>;
}
