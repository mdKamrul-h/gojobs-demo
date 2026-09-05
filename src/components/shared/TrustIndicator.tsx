"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrustStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrustIndicatorProps {
  status: TrustStatus;
  className?: string;
}

export function TrustIndicator({ status, className }: TrustIndicatorProps) {
  const t = useTranslations("trust");

  const config = {
    approved: {
      icon: ShieldCheck,
      label: t("employerVerified"),
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    },
    pending: {
      icon: ShieldQuestion,
      label: t("trustPending"),
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    },
    rejected: {
      icon: ShieldAlert,
      label: t("notVerified"),
      className:
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    },
  }[status];

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
