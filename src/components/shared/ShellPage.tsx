"use client";

import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

interface ShellPageProps {
  title: string;
}

export function ShellPage({ title }: ShellPageProps) {
  const t = useTranslations("shell");

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <Construction className="mb-6 h-16 w-16 text-muted-foreground/50" />
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{t("comingSoon")}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
}
