"use client";

import { useTranslations } from "next-intl";
import { Download, FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { CvContent } from "@/lib/mock/fixtures/cv-content";
import { cn } from "@/lib/utils";

interface CvSidebarPanelProps {
  cv: CvContent;
  open: boolean;
  onToggle: () => void;
  className?: string;
}

export function CvSidebarPanel({ cv, open, onToggle, className }: CvSidebarPanelProps) {
  const t = useTranslations("employer.review.cv");

  const handleDownload = () => {
    toast.info(t("downloadMock", { filename: cv.fileName }));
  };

  if (!open) {
    return (
      <div className={cn("hidden lg:flex flex-col items-center py-4", className)}>
        <Button variant="outline" size="icon" onClick={onToggle} aria-label={t("showCv")}>
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col border rounded-lg bg-card overflow-hidden lg:w-72 xl:w-80 shrink-0",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{t("title")}</p>
            <p className="text-xs text-muted-foreground truncate">{cv.fileName}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={onToggle} aria-label={t("hideCv")}>
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("contact")}</p>
          <p className="mt-1">{cv.contact.email}</p>
          <p>{cv.contact.phone}</p>
          {cv.contact.location && <p className="text-muted-foreground">{cv.contact.location}</p>}
        </div>

        <Separator />

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("summary")}</p>
          <p className="mt-1 text-muted-foreground leading-relaxed">{cv.summary}</p>
        </div>

        {cv.sections.map((section) => (
          <div key={section.title}>
            <Separator className="mb-3" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{section.title}</p>
            <ul className="mt-2 space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-muted-foreground leading-relaxed pl-3 border-l-2 border-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t p-3 space-y-2">
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          {t("download")}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">{t("sourceDisclaimer")}</p>
      </div>
    </aside>
  );
}
