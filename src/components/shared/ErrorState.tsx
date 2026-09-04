"use client";

import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h3 className="text-lg font-semibold text-foreground">{title ?? t("error")}</h3>
      {message && <p className="max-w-sm text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
