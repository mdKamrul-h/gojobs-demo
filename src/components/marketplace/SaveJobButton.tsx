"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useCandidate } from "@/components/candidate/useCandidate";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { isJobSaved, toggleSavedJob } from "@/lib/mock/services/candidates";
import { cn } from "@/lib/utils";

interface SaveJobButtonProps {
  jobId: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  showLabel?: boolean;
}

export function SaveJobButton({
  jobId,
  className,
  size = "icon",
  showLabel = false,
}: SaveJobButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, role } = useDemoAuth();
  const { candidate, refresh } = useCandidate();
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!candidate) {
      setSaved(false);
      return;
    }
    isJobSaved(candidate.id, jobId).then(setSaved);
  }, [candidate, jobId]);

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || role !== "candidate" || !candidate) {
      toast.info(t("common.loginToSave"));
      router.push("/login");
      return;
    }

    setPending(true);
    const next = !saved;
    setSaved(next);
    try {
      await toggleSavedJob(candidate.id, jobId);
      await refresh();
      toast.success(next ? t("jobs.savedToast") : t("jobs.unsavedToast"));
    } catch {
      setSaved(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={showLabel ? "outline" : "ghost"}
      size={size}
      disabled={pending}
      onClick={handleSave}
      aria-pressed={saved}
      aria-label={saved ? t("jobs.unsaveJob") : t("jobs.saveJob")}
      className={cn(showLabel && "gap-2", className)}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {showLabel && (saved ? t("common.unsave") : t("common.save"))}
    </Button>
  );
}
