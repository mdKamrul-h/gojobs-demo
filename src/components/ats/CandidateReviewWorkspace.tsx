"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import { CvSidebarPanel } from "@/components/ats/CvSidebarPanel";
import { CandidateReviewHeader } from "@/components/ats/CandidateReviewHeader";
import { CandidateReviewTabs } from "@/components/ats/CandidateReviewTabs";
import { CandidateReviewActionsPanel } from "@/components/ats/CandidateReviewActionsPanel";
import {
  getApplicationByIdAsync,
  addApplicationNote,
  updateApplicationStage,
  getApplicationsByJobIdAsync,
} from "@/lib/mock/services/applications";
import { getCandidateByIdAsync } from "@/lib/mock/services/candidates";
import { getEmployerJobById } from "@/lib/mock/services/employer";
import { getAssessmentByApplicationIdAsync } from "@/lib/mock/services/assessments";
import {
  getCvFromCandidate,
  getGuestCvByEmail,
  type CvContent,
} from "@/lib/mock/fixtures/cv-content";
import type { Application, ApplicationStage, Candidate, GeneralAssessment, Job } from "@/lib/types";

interface CandidateReviewWorkspaceProps {
  jobId: string;
  applicationId: string;
}

export function CandidateReviewWorkspace({ jobId, applicationId }: CandidateReviewWorkspaceProps) {
  const t = useTranslations("employer.review");
  const [application, setApplication] = useState<Application | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<GeneralAssessment | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvOpen, setCvOpen] = useState(true);

  const load = async () => {
    setLoading(true);
    const app = await getApplicationByIdAsync(applicationId);
    if (!app) {
      setApplication(null);
      setLoading(false);
      return;
    }
    setApplication(app);

    const [j, ga, apps] = await Promise.all([
      getEmployerJobById(jobId),
      getAssessmentByApplicationIdAsync(applicationId),
      getApplicationsByJobIdAsync(jobId),
    ]);
    setJob(j ?? null);
    setAssessment(ga ?? null);
    setJobApplications(
      apps.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime())
    );

    if (app.candidateId) {
      const cand = await getCandidateByIdAsync(app.candidateId);
      setCandidate(cand ?? null);
    } else {
      setCandidate(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [jobId, applicationId]);

  const candidateName =
    candidate?.name ?? application?.guestInfo?.name ?? t("unknownCandidate");

  const cvContent: CvContent | null = useMemo(() => {
    if (candidate) return getCvFromCandidate(candidate);
    if (application?.guestInfo?.email) {
      return (
        getGuestCvByEmail(application.guestInfo.email) ??
        (application.guestInfo.cvFileName
          ? {
              fileName: application.guestInfo.cvFileName,
              summary: application.guestInfo.coverNote ?? t("cv.noExtractedSummary"),
              contact: {
                email: application.guestInfo.email,
                phone: application.guestInfo.phone,
                location: application.guestInfo.location,
              },
              sections: [],
            }
          : null)
      );
    }
    return null;
  }, [candidate, application, t]);

  const { prevAppId, nextAppId } = useMemo(() => {
    const idx = jobApplications.findIndex((a) => a.id === applicationId);
    return {
      prevAppId: idx > 0 ? jobApplications[idx - 1]?.id : undefined,
      nextAppId: idx >= 0 && idx < jobApplications.length - 1 ? jobApplications[idx + 1]?.id : undefined,
    };
  }, [jobApplications, applicationId]);

  const handleStageChange = async (stage: ApplicationStage) => {
    if (!application) return;
    setSaving(true);
    try {
      const updated = await updateApplicationStage(application.id, stage);
      if (updated) {
        setApplication(updated);
        toast.success(t("stageUpdated"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!application || !note.trim()) return;
    setSaving(true);
    try {
      const updated = await addApplicationNote(application.id, note.trim());
      if (updated) {
        setApplication(updated);
        setNote("");
        toast.success(t("noteAdded"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!application || !job) {
    return (
      <div className="container py-12 text-center text-muted-foreground">{t("notFound")}</div>
    );
  }

  return (
    <div className="container py-6 max-w-[1600px]">
      <CandidateReviewHeader
        job={job}
        jobId={jobId}
        application={application}
        candidateName={candidateName}
        prevAppId={prevAppId}
        nextAppId={nextAppId}
        cvOpen={cvOpen}
        onToggleCv={() => setCvOpen((v) => !v)}
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {cvContent && (
          <CvSidebarPanel
            cv={cvContent}
            open={cvOpen}
            onToggle={() => setCvOpen((v) => !v)}
            className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)]"
          />
        )}

        <div className="min-w-0 flex-1">
          <CandidateReviewTabs
            application={application}
            candidate={candidate}
            job={job}
            assessment={assessment}
            candidateName={candidateName}
          />
        </div>

        <CandidateReviewActionsPanel
          application={application}
          saving={saving}
          note={note}
          onNoteChange={setNote}
          onStageChange={handleStageChange}
          onAddNote={handleAddNote}
        />
      </div>
    </div>
  );
}
