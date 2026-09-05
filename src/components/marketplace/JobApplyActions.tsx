"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShareButton } from "./ShareButton";
import { SaveJobButton } from "./SaveJobButton";

interface JobApplyActionsProps {
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  shareUrl: string;
}

export function JobApplyActions({
  jobId,
  jobSlug,
  jobTitle,
  shareUrl,
}: JobApplyActionsProps) {
  const t = useTranslations();

  return (
    <>
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <Link href={`/jobs/${jobSlug}/apply`} className={cn(buttonVariants({ size: "lg" }))}>
          {t("jobs.apply")}
        </Link>
        <SaveJobButton jobId={jobId} showLabel size="lg" />
        <ShareButton title={jobTitle} url={shareUrl} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="container flex items-center gap-2">
          <SaveJobButton jobId={jobId} showLabel className="flex-1" />
          <Link
            href={`/jobs/${jobSlug}/apply`}
            className={cn(buttonVariants(), "flex-1")}
          >
            {t("jobs.apply")}
          </Link>
        </div>
      </div>
    </>
  );
}
