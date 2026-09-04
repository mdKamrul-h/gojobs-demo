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
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      icon: ShieldQuestion,
      label: t("trustPending"),
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    rejected: {
      icon: ShieldAlert,
      label: t("notVerified"),
      className: "bg-slate-100 text-slate-600 border-slate-200",
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
