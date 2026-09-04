"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { ErrorState } from "@/components/shared/ErrorState";

interface EmployerGuardProps {
  children: ReactNode;
  locale: string;
}

export function EmployerGuard({ children }: EmployerGuardProps) {
  const t = useTranslations("employer.guard");
  const { role, isAuthenticated } = useDemoAuth();
  const router = useRouter();
  const isRecruiter = role === "recruiter";

  useEffect(() => {
    if (!isAuthenticated || !isRecruiter) {
      router.replace("/login");
    }
  }, [isAuthenticated, isRecruiter, router]);

  if (!isAuthenticated || !isRecruiter) {
    return (
      <div className="container py-12">
        <ErrorState title={t("title")} message={t("description")} />
      </div>
    );
  }

  return <>{children}</>;
}
