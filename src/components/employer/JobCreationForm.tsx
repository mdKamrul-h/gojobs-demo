"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Eye, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LocationPicker } from "@/components/shared/LocationPicker";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { JobCopilot } from "./JobCopilot";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { publishJob, saveJobDraft, type JobDraft } from "@/lib/mock/services/employer";
import type { Occupation, Requirement, ScreeningQuestion, Seniority, WorkMode } from "@/lib/types";

const occupations: Occupation[] = [
  "accountant",
  "hr_manager",
  "sales_executive",
  "rmg_merchandiser",
  "software_engineer",
  "marketing_manager",
  "operations_manager",
  "customer_service",
];

const seniorities: Seniority[] = ["entry", "mid", "senior", "lead", "manager"];
const workModes: WorkMode[] = ["on_site", "hybrid", "remote"];

const defaultScreening: ScreeningQuestion[] = [
  {
    id: "sq-exp",
    question: "How many years of relevant experience do you have?",
    type: "text",
    required: true,
  },
  {
    id: "sq-notice",
    question: "What is your notice period?",
    type: "text",
    required: true,
  },
];

const emptyDraft: JobDraft = {
  title: "",
  occupation: "hr_manager",
  seniority: "mid",
  companyId: "",
  location: { divisionId: "dhaka", districtId: "dhaka-metro" },
  salary: { min: 50000, max: 80000, currency: "BDT", period: "monthly" },
  workMode: "on_site",
  hardRequirements: [],
  softRequirements: [],
  description: "",
  responsibilities: [],
  screeningQuestions: defaultScreening,
  status: "draft",
};

export function JobCreationForm({ locale }: { locale: string }) {
  const t = useTranslations("employer.jobCreation");
  const tc = useTranslations("common");
  const router = useRouter();
  const { user } = useDemoAuth();
  const companyId = user?.companyId ?? "comp-bkash";

  const [draft, setDraft] = useState<JobDraft>({ ...emptyDraft, companyId });
  const [savedJobId, setSavedJobId] = useState<string | undefined>();
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [respInput, setRespInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("form");

  const applySuggestion = useCallback((partial: Partial<JobDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      hardRequirements: partial.hardRequirements ?? prev.hardRequirements,
      softRequirements: partial.softRequirements ?? prev.softRequirements,
      responsibilities: partial.responsibilities ?? prev.responsibilities,
      screeningQuestions: partial.screeningQuestions ?? prev.screeningQuestions,
      location: partial.location ? { ...prev.location, ...partial.location } : prev.location,
      salary: partial.salary ? { ...prev.salary, ...partial.salary } : prev.salary,
    }));
  }, []);

  const addRequirement = (type: "hard" | "soft", label: string) => {
    if (!label.trim()) return;
    const req: Requirement = {
      id: `${type}-${Date.now()}`,
      label: label.trim(),
      type,
    };
    setDraft((prev) => ({
      ...prev,
      [type === "hard" ? "hardRequirements" : "softRequirements"]: [
        ...(type === "hard" ? prev.hardRequirements : prev.softRequirements),
        req,
      ],
    }));
    if (type === "hard") setHardInput("");
    else setSoftInput("");
  };

  const addResponsibility = () => {
    if (!respInput.trim()) return;
    setDraft((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, respInput.trim()],
    }));
    setRespInput("");
  };

  const addQuestion = () => {
    if (!questionInput.trim()) return;
    setDraft((prev) => ({
      ...prev,
      screeningQuestions: [
        ...prev.screeningQuestions,
        {
          id: `sq-${Date.now()}`,
          question: questionInput.trim(),
          type: "text" as const,
          required: true,
        },
      ],
    }));
    setQuestionInput("");
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveJobDraft(companyId, draft, savedJobId);
      setSavedJobId(saved.id);
      setDraft(saved);
      toast.success(t("draftSaved"));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const saved = await saveJobDraft(companyId, draft, savedJobId);
      const published = await publishJob(saved.id);
      if (published) {
        toast.success(t("published"));
        router.push(`/employer/jobs/${published.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <TabsList>
            <TabsTrigger value="form">{t("tabs.form")}</TabsTrigger>
            <TabsTrigger value="preview">{t("tabs.preview")}</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {t("saveDraft")}
            </Button>
            <Button onClick={handlePublish} disabled={saving || !draft.title}>
              <Send className="h-4 w-4 mr-2" />
              {t("publish")}
            </Button>
          </div>
        </div>

        <TabsContent value="form" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <Card>
              <CardHeader>
                <CardTitle>{t("jobDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("fields.title")}</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("fields.occupation")}</Label>
                    <Select
                      value={draft.occupation}
                      onValueChange={(v) => setDraft({ ...draft, occupation: v as Occupation })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {occupations.map((o) => (
                          <SelectItem key={o} value={o}>
                            {t(`occupations.${o}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.seniority")}</Label>
                    <Select
                      value={draft.seniority}
                      onValueChange={(v) => setDraft({ ...draft, seniority: v as Seniority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {seniorities.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`seniorities.${s}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.description")}</Label>
                  <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <Separator />

                <RequirementSection
                  label={t("fields.hardRequirements")}
                  items={draft.hardRequirements}
                  input={hardInput}
                  onInputChange={setHardInput}
                  onAdd={() => addRequirement("hard", hardInput)}
                  onRemove={(id) =>
                    setDraft({
                      ...draft,
                      hardRequirements: draft.hardRequirements.filter((r) => r.id !== id),
                    })
                  }
                />

                <RequirementSection
                  label={t("fields.softRequirements")}
                  items={draft.softRequirements}
                  input={softInput}
                  onInputChange={setSoftInput}
                  onAdd={() => addRequirement("soft", softInput)}
                  onRemove={(id) =>
                    setDraft({
                      ...draft,
                      softRequirements: draft.softRequirements.filter((r) => r.id !== id),
                    })
                  }
                />

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("fields.salaryMin")}</Label>
                    <Input
                      type="number"
                      value={draft.salary.min}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          salary: { ...draft.salary, min: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.salaryMax")}</Label>
                    <Input
                      type="number"
                      value={draft.salary.max}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          salary: { ...draft.salary, max: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.location")}</Label>
                  <LocationPicker
                    value={draft.location}
                    onChange={(loc) => setDraft({ ...draft, location: { ...draft.location, ...loc } })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.workMode")}</Label>
                  <Select
                    value={draft.workMode}
                    onValueChange={(v) => setDraft({ ...draft, workMode: v as WorkMode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workModes.map((m) => (
                        <SelectItem key={m} value={m}>
                          {t(`workModes.${m}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>{t("fields.responsibilities")}</Label>
                  <div className="flex gap-2">
                    <Input value={respInput} onChange={(e) => setRespInput(e.target.value)} />
                    <Button type="button" variant="outline" onClick={addResponsibility}>
                      {tc("save")}
                    </Button>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {draft.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.screeningQuestions")}</Label>
                  <div className="flex gap-2">
                    <Input value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} />
                    <Button type="button" variant="outline" onClick={addQuestion}>
                      {tc("save")}
                    </Button>
                  </div>
                  <ul className="text-sm space-y-1">
                    {draft.screeningQuestions.map((q) => (
                      <li key={q.id} className="text-muted-foreground">
                        {q.question}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <JobCopilot onApplySuggestion={applySuggestion} />
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{draft.title || t("untitled")}</CardTitle>
                  <CardDescription className="mt-1">
                    {t(`occupations.${draft.occupation}`)} · {t(`seniorities.${draft.seniority}`)}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{t("previewBadge")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <SalaryDisplay salary={draft.salary} locale={locale} />
                <Badge variant="outline">{t(`workModes.${draft.workMode}`)}</Badge>
              </div>
              <p className="text-sm">{draft.description}</p>
              {draft.hardRequirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">{t("fields.hardRequirements")}</h4>
                  <div className="flex flex-wrap gap-1">
                    {draft.hardRequirements.map((r) => (
                      <Badge key={r.id} variant="secondary">
                        {r.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="outline" onClick={() => setTab("form")}>
                <Eye className="h-4 w-4 mr-2" />
                {t("editForm")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequirementSection({
  label,
  items,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: Requirement[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const tc = useTranslations("common");
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => onInputChange(e.target.value)} />
        <Button type="button" variant="outline" onClick={onAdd}>
          {tc("save")}
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((r) => (
          <Badge
            key={r.id}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onRemove(r.id)}
          >
            {r.label} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}
