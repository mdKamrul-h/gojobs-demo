"use client";

import { JobReportFlow, ScamWarningBanner } from "@/components/trust/JobReportFlow";
import { EmployerReputationDisplay } from "@/components/trust/EmployerReputationDisplay";
import type { Company, Job } from "@/lib/types";

interface JobTrustSectionProps {
  job: Job;
  company: Company;
}

export function JobTrustSection({ job, company }: JobTrustSectionProps) {
  const showScamWarning = company.trustStatus === "pending" || company.trustStatus === "rejected";

  return (
    <div className="space-y-4">
      {showScamWarning && (
        <ScamWarningBanner variant={company.trustStatus === "rejected" ? "blocked" : "warning"} />
      )}
      <EmployerReputationDisplay
        companyName={company.name}
        trustStatus={company.trustStatus}
        jobsPosted={12}
        responseRate={78}
        avgReviewDays={5}
        flags={company.trustStatus === "approved" ? ["responsive", "verified_employer"] : []}
      />
      <JobReportFlow jobId={job.id} jobTitle={job.title} />
    </div>
  );
}
