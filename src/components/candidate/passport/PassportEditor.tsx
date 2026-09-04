"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useCandidate } from "@/components/candidate/useCandidate";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import { LocationPicker } from "@/components/shared/LocationPicker";
import { LoadingState } from "@/components/shared/LoadingState";
import { updateCandidatePassport } from "@/lib/mock/services/candidates";
import type {
  CareerPassport,
  Education,
  Experience,
  Skill,
  VisibilityStatus,
  WorkMode,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function PassportEditor() {
  const t = useTranslations("candidate.passport");
  const tCommon = useTranslations("common");
  const { candidate, loading, refresh } = useCandidate();
  const [passport, setPassport] = useState<CareerPassport | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      setPassport(structuredClone(candidate.passport));
    }
  }, [candidate]);

  const handleSave = async () => {
    if (!candidate || !passport) return;
    setSaving(true);
    await updateCandidatePassport(candidate.id, passport);
    await refresh();
    toast.success(t("saved"));
    setSaving(false);
  };

  const updatePassport = (partial: Partial<CareerPassport>) => {
    setPassport((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  if (loading || !candidate || !passport) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  const workModes: WorkMode[] = ["on_site", "hybrid", "remote"];
  const visibilityOptions: VisibilityStatus[] = ["actively_looking", "open", "private"];

  return (
    <div className="container mx-auto px-4 py-8">
      <CandidateNav />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="min-w-[120px]">
            <p className="mb-1 text-xs text-muted-foreground">
              {t("completeness", { percent: passport.completeness })}
            </p>
            <Progress value={passport.completeness} className="h-2" />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? tCommon("loading") : tCommon("save")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="identity">{t("tabs.identity")}</TabsTrigger>
          <TabsTrigger value="experience">{t("tabs.experience")}</TabsTrigger>
          <TabsTrigger value="education">{t("tabs.education")}</TabsTrigger>
          <TabsTrigger value="skills">{t("tabs.skills")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("tabs.preferences")}</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle>{t("tabs.identity")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("identity.headline")}</Label>
                <Input
                  value={passport.headline}
                  onChange={(e) => updatePassport({ headline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("identity.summary")}</Label>
                <Textarea
                  value={passport.summary}
                  onChange={(e) => updatePassport({ summary: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("identity.phone")}</Label>
                  <Input
                    value={passport.phone}
                    onChange={(e) => updatePassport({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("identity.email")}</Label>
                  <Input
                    type="email"
                    value={passport.email}
                    onChange={(e) => updatePassport({ email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("identity.visibility")}</Label>
                <p className="text-xs text-muted-foreground">{t("identity.visibilityHelp")}</p>
                <div className="flex flex-wrap gap-2">
                  {visibilityOptions.map((v) => (
                    <Button
                      key={v}
                      type="button"
                      size="sm"
                      variant={passport.visibility === v ? "default" : "outline"}
                      onClick={() => updatePassport({ visibility: v })}
                    >
                      {t(`identity.visibility${v === "actively_looking" ? "ActivelyLooking" : v === "open" ? "Open" : "Private"}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("tabs.experience")}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updatePassport({
                    experience: [
                      ...passport.experience,
                      {
                        id: newId("exp"),
                        title: "",
                        company: "",
                        startDate: "",
                        current: false,
                        responsibilities: [],
                        achievements: [],
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                {t("experience.addExperience")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {passport.experience.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("experience.noExperience")}</p>
              ) : (
                passport.experience.map((exp, idx) => (
                  <ExperienceEntry
                    key={exp.id}
                    exp={exp}
                    t={t}
                    onChange={(updated) => {
                      const experience = [...passport.experience];
                      experience[idx] = updated;
                      updatePassport({ experience });
                    }}
                    onRemove={() =>
                      updatePassport({
                        experience: passport.experience.filter((e) => e.id !== exp.id),
                      })
                    }
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("tabs.education")}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updatePassport({
                    education: [
                      ...passport.education,
                      {
                        id: newId("edu"),
                        institution: "",
                        degree: "",
                        field: "",
                        startDate: "",
                        current: false,
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                {t("education.addEducation")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {passport.education.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("education.noEducation")}</p>
              ) : (
                passport.education.map((edu, idx) => (
                  <div key={edu.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updatePassport({
                            education: passport.education.filter((e) => e.id !== edu.id),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t("education.institution")}</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const education = [...passport.education];
                            education[idx] = { ...edu, institution: e.target.value };
                            updatePassport({ education });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("education.degree")}</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const education = [...passport.education];
                            education[idx] = { ...edu, degree: e.target.value };
                            updatePassport({ education });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("education.field")}</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => {
                            const education = [...passport.education];
                            education[idx] = { ...edu, field: e.target.value };
                            updatePassport({ education });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("education.startDate")}</Label>
                        <Input
                          value={edu.startDate}
                          onChange={(e) => {
                            const education = [...passport.education];
                            education[idx] = { ...edu, startDate: e.target.value };
                            updatePassport({ education });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("tabs.skills")}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updatePassport({
                    skills: [
                      ...passport.skills,
                      {
                        id: newId("sk"),
                        name: "",
                        level: "intermediate",
                        evidence: "candidate_provided",
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                {t("skills.addSkill")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {passport.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("skills.noSkills")}</p>
              ) : (
                passport.skills.map((skill, idx) => (
                  <div key={skill.id} className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                    <div className="min-w-[160px] flex-1 space-y-2">
                      <Label>{t("skills.name")}</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) => {
                          const skills = [...passport.skills];
                          skills[idx] = { ...skill, name: e.target.value };
                          updatePassport({ skills });
                        }}
                      />
                    </div>
                    <div className="w-[140px] space-y-2">
                      <Label>{t("skills.level")}</Label>
                      <Select
                        value={skill.level}
                        onValueChange={(level) => {
                          const skills = [...passport.skills];
                          skills[idx] = {
                            ...skill,
                            level: level as Skill["level"],
                          };
                          updatePassport({ skills });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["beginner", "intermediate", "advanced", "expert"] as const).map(
                            (lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {t(`skills.levels.${lvl}`)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <EvidenceBadge source={skill.evidence} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updatePassport({
                          skills: passport.skills.filter((s) => s.id !== skill.id),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("tabs.preferences")}</CardTitle>
              <CardDescription>{t("preferences.desiredRolesPlaceholder")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("preferences.desiredRoles")}</Label>
                <Input
                  value={passport.preferences.desiredRoles.join(", ")}
                  onChange={(e) =>
                    updatePassport({
                      preferences: {
                        ...passport.preferences,
                        desiredRoles: e.target.value
                          .split(",")
                          .map((r) => r.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder={t("preferences.desiredRolesPlaceholder")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("preferences.salaryMin")}</Label>
                  <Input
                    type="number"
                    value={passport.preferences.salaryExpectation.min || ""}
                    onChange={(e) =>
                      updatePassport({
                        preferences: {
                          ...passport.preferences,
                          salaryExpectation: {
                            ...passport.preferences.salaryExpectation,
                            min: Number(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("preferences.salaryMax")}</Label>
                  <Input
                    type="number"
                    value={passport.preferences.salaryExpectation.max || ""}
                    onChange={(e) =>
                      updatePassport({
                        preferences: {
                          ...passport.preferences,
                          salaryExpectation: {
                            ...passport.preferences.salaryExpectation,
                            max: Number(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("preferences.locations")}</Label>
                <LocationPicker
                  value={passport.preferences.preferredLocations[0]}
                  onChange={(loc) =>
                    updatePassport({
                      preferences: {
                        ...passport.preferences,
                        preferredLocations: loc.divisionId ? [loc as typeof passport.preferences.preferredLocations[0]] : [],
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("preferences.workMode")}</Label>
                <div className="flex flex-wrap gap-3">
                  {workModes.map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={passport.preferences.workMode.includes(mode)}
                        onCheckedChange={(checked) => {
                          const current = passport.preferences.workMode;
                          updatePassport({
                            preferences: {
                              ...passport.preferences,
                              workMode: checked
                                ? [...current, mode]
                                : current.filter((m) => m !== mode),
                            },
                          });
                        }}
                      />
                      {t(`preferences.workModes.${mode}`)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("preferences.noticePeriod")}</Label>
                <Input
                  type="number"
                  value={passport.preferences.noticePeriodDays}
                  onChange={(e) =>
                    updatePassport({
                      preferences: {
                        ...passport.preferences,
                        noticePeriodDays: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <h4 className="font-medium text-sm">{t("preferences.globalTitle")}</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("preferences.country")}</Label>
                    <Input
                      value={passport.preferences.country ?? "Bangladesh"}
                      onChange={(e) =>
                        updatePassport({
                          preferences: { ...passport.preferences, country: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("preferences.timezone")}</Label>
                    <Input
                      value={passport.preferences.timezone ?? "Asia/Dhaka"}
                      onChange={(e) =>
                        updatePassport({
                          preferences: { ...passport.preferences, timezone: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("preferences.workAuthorization")}</Label>
                  <Input
                    value={(passport.preferences.workAuthorization ?? ["Bangladesh"]).join(", ")}
                    onChange={(e) =>
                      updatePassport({
                        preferences: {
                          ...passport.preferences,
                          workAuthorization: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder={t("preferences.workAuthorizationPlaceholder")}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={passport.preferences.openToRemoteGlobal ?? false}
                    onCheckedChange={(checked) =>
                      updatePassport({
                        preferences: {
                          ...passport.preferences,
                          openToRemoteGlobal: !!checked,
                        },
                      })
                    }
                  />
                  {t("preferences.openToRemoteGlobal")}
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExperienceEntry({
  exp,
  t,
  onChange,
  onRemove,
}: {
  exp: Experience;
  t: ReturnType<typeof useTranslations>;
  onChange: (exp: Experience) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("experience.title")}</Label>
          <Input value={exp.title} onChange={(e) => onChange({ ...exp, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("experience.company")}</Label>
          <Input value={exp.company} onChange={(e) => onChange({ ...exp, company: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("experience.location")}</Label>
          <Input value={exp.location ?? ""} onChange={(e) => onChange({ ...exp, location: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("experience.startDate")}</Label>
          <Input value={exp.startDate} onChange={(e) => onChange({ ...exp, startDate: e.target.value })} />
        </div>
        {!exp.current && (
          <div className="space-y-2">
            <Label>{t("experience.endDate")}</Label>
            <Input value={exp.endDate ?? ""} onChange={(e) => onChange({ ...exp, endDate: e.target.value })} />
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={exp.current}
          onCheckedChange={(checked) =>
            onChange({ ...exp, current: !!checked, endDate: checked ? undefined : exp.endDate })
          }
        />
        {t("experience.current")}
      </label>
    </div>
  );
}
