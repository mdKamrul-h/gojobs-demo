"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import { LocationPicker } from "@/components/shared/LocationPicker";
import { LoadingState } from "@/components/shared/LoadingState";
import { updateCandidatePassport } from "@/lib/mock/services/candidates";
import type { CareerPassport } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STEPS = ["upload", "review", "confirm", "preferences"] as const;
type Step = (typeof STEPS)[number];

const EXTRACTED_PASSPORT: Partial<CareerPassport> = {
  headline: "Professional | Industry Specialist",
  summary:
    "Experienced professional with a track record of delivering results. Skilled in core domain competencies with strong communication abilities.",
  experience: [
    {
      id: "onb-exp-1",
      title: "Senior Specialist",
      company: "Leading Company Ltd.",
      location: "Dhaka",
      startDate: "2021-01",
      current: true,
      responsibilities: ["Lead key projects", "Collaborate with cross-functional teams"],
      achievements: ["Exceeded targets by 20%"],
    },
  ],
  education: [
    {
      id: "onb-edu-1",
      institution: "University of Dhaka",
      degree: "Bachelor's",
      field: "Business Administration",
      startDate: "2015",
      endDate: "2019",
      current: false,
    },
  ],
  skills: [
    { id: "onb-sk-1", name: "Project Management", level: "advanced", evidence: "cv_extracted" },
    { id: "onb-sk-2", name: "Communication", level: "advanced", evidence: "cv_extracted" },
    { id: "onb-sk-3", name: "MS Office", level: "expert", evidence: "cv_extracted" },
  ],
};

export function OnboardingWizard() {
  const t = useTranslations("candidate.onboarding");
  const tPassport = useTranslations("candidate.passport");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { candidate, loading, refresh } = useCandidate();
  const [step, setStep] = useState<Step>("upload");
  const [filename, setFilename] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [passport, setPassport] = useState<CareerPassport | null>(null);
  const [saving, setSaving] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const handleUpload = () => {
    setProcessing(true);
    setTimeout(() => {
      setFilename("my_cv.pdf");
      setProcessing(false);
      if (candidate) {
        setPassport({
          ...candidate.passport,
          ...EXTRACTED_PASSPORT,
          phone: candidate.passport.phone || "+8801XXXXXXXXX",
          email: candidate.passport.email || candidate.passport.email,
        } as CareerPassport);
      }
      setStep("review");
    }, 1500);
  };

  const handleComplete = async () => {
    if (!candidate || !passport) return;
    setSaving(true);
    await updateCandidatePassport(candidate.id, passport);
    await refresh();
    toast.success(t("completed"));
    router.push("/candidate");
    setSaving(false);
  };

  if (loading || !candidate) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  const currentPassport = passport ?? candidate.passport;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <CandidateNav />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        <Progress value={progress} className="mt-4 h-2" />
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          {STEPS.map((s) => (
            <span
              key={s}
              className={cn(
                STEPS.indexOf(s) <= stepIndex && "font-medium text-foreground"
              )}
            >
              {t(`steps.${s}`)}
            </span>
          ))}
        </div>
      </div>

      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("upload.title")}</CardTitle>
            <CardDescription>{t("upload.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={handleUpload}
              disabled={processing}
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:border-primary hover:bg-muted/30"
            >
              {processing ? (
                <>
                  <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">{t("upload.processing")}</p>
                </>
              ) : filename ? (
                <>
                  <FileText className="mb-4 h-12 w-12 text-primary" />
                  <p className="text-sm font-medium">{t("upload.uploaded", { filename })}</p>
                </>
              ) : (
                <>
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("upload.dropzone")}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{t("upload.formats")}</p>
                </>
              )}
            </button>
          </CardContent>
        </Card>
      )}

      {step === "review" && currentPassport && (
        <Card>
          <CardHeader>
            <CardTitle>{t("review.title")}</CardTitle>
            <CardDescription>{t("review.description")}</CardDescription>
            <p className="text-xs text-muted-foreground">{t("review.sourceNote")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Label>{tPassport("identity.headline")}</Label>
                <EvidenceBadge source="cv_extracted" />
              </div>
              <p className="text-sm">{currentPassport.headline}</p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Label>{tPassport("tabs.experience")}</Label>
                <EvidenceBadge source="cv_extracted" />
              </div>
              {currentPassport.experience.map((exp) => (
                <p key={exp.id} className="text-sm">
                  {exp.title} at {exp.company}
                </p>
              ))}
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Label>{tPassport("tabs.skills")}</Label>
                <EvidenceBadge source="cv_extracted" />
              </div>
              <div className="flex flex-wrap gap-2">
                {currentPassport.skills.map((sk) => (
                  <span key={sk.id} className="rounded-full bg-muted px-2 py-1 text-xs">
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("upload")}>
                {tCommon("back")}
              </Button>
              <Button onClick={() => setStep("confirm")}>{tCommon("next")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "confirm" && currentPassport && (
        <Card>
          <CardHeader>
            <CardTitle>{t("confirm.title")}</CardTitle>
            <CardDescription>{t("confirm.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{tPassport("identity.headline")}</Label>
              <Input
                value={currentPassport.headline}
                onChange={(e) =>
                  setPassport({ ...currentPassport, headline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{tPassport("identity.summary")}</Label>
              <Textarea
                value={currentPassport.summary}
                onChange={(e) =>
                  setPassport({ ...currentPassport, summary: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{tPassport("identity.phone")}</Label>
                <Input
                  value={currentPassport.phone}
                  onChange={(e) =>
                    setPassport({ ...currentPassport, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{tPassport("identity.email")}</Label>
                <Input
                  value={currentPassport.email}
                  onChange={(e) =>
                    setPassport({ ...currentPassport, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("review")}>
                {tCommon("back")}
              </Button>
              <Button onClick={() => setStep("preferences")}>{tCommon("next")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "preferences" && currentPassport && (
        <Card>
          <CardHeader>
            <CardTitle>{t("preferences.title")}</CardTitle>
            <CardDescription>{t("preferences.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{tPassport("preferences.desiredRoles")}</Label>
              <Input
                placeholder={tPassport("preferences.desiredRolesPlaceholder")}
                value={currentPassport.preferences.desiredRoles.join(", ")}
                onChange={(e) =>
                  setPassport({
                    ...currentPassport,
                    preferences: {
                      ...currentPassport.preferences,
                      desiredRoles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{tPassport("preferences.salaryMin")}</Label>
                <Input
                  type="number"
                  value={currentPassport.preferences.salaryExpectation.min || ""}
                  onChange={(e) =>
                    setPassport({
                      ...currentPassport,
                      preferences: {
                        ...currentPassport.preferences,
                        salaryExpectation: {
                          ...currentPassport.preferences.salaryExpectation,
                          min: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{tPassport("preferences.salaryMax")}</Label>
                <Input
                  type="number"
                  value={currentPassport.preferences.salaryExpectation.max || ""}
                  onChange={(e) =>
                    setPassport({
                      ...currentPassport,
                      preferences: {
                        ...currentPassport.preferences,
                        salaryExpectation: {
                          ...currentPassport.preferences.salaryExpectation,
                          max: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{tPassport("preferences.locations")}</Label>
              <LocationPicker
                value={currentPassport.preferences.preferredLocations[0]}
                onChange={(loc) =>
                  setPassport({
                    ...currentPassport,
                    preferences: {
                      ...currentPassport.preferences,
                      preferredLocations: loc.divisionId
                        ? [loc as typeof currentPassport.preferences.preferredLocations[0]]
                        : [],
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{tPassport("preferences.workMode")}</Label>
              <div className="flex flex-wrap gap-3">
                {(["on_site", "hybrid", "remote"] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={currentPassport.preferences.workMode.includes(mode)}
                      onCheckedChange={(checked) => {
                        const current = currentPassport.preferences.workMode;
                        setPassport({
                          ...currentPassport,
                          preferences: {
                            ...currentPassport.preferences,
                            workMode: checked
                              ? [...current, mode]
                              : current.filter((m) => m !== mode),
                          },
                        });
                      }}
                    />
                    {tPassport(`preferences.workModes.${mode}`)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("confirm")}>
                {tCommon("back")}
              </Button>
              <Button onClick={handleComplete} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {t("complete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
