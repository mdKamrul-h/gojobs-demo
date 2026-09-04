"use client";

import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";

interface JobApplyActionsProps {
  jobSlug: string;
  jobTitle: string;
  shareUrl: string;
  applyGuestLabel: string;
  applyPassportLabel: string;
}

export function JobApplyActions({
  jobSlug,
  jobTitle,
  shareUrl,
  applyGuestLabel,
  applyPassportLabel,
}: JobApplyActionsProps) {
  const { role, isAuthenticated } = useDemoAuth();

  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/jobs/${jobSlug}/apply`}>
        <Button size="lg">{applyGuestLabel}</Button>
      </Link>
      {role === "candidate" && isAuthenticated && (
        <Link href={`/jobs/${jobSlug}/apply`}>
          <Button size="lg" variant="outline">
            {applyPassportLabel}
          </Button>
        </Link>
      )}
      <ShareButton title={jobTitle} url={shareUrl} />
    </div>
  );
}
