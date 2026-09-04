"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "@/i18n/routing";
import { Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { submitGuestApplication } from "@/lib/mock/services/applications";
import type { Job, ScreeningQuestion } from "@/lib/types";

const bdPhoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;

function createSchema(questions: ScreeningQuestion[]) {
  const screeningShape: Record<string, z.ZodTypeAny> = {};
  for (const q of questions) {
    screeningShape[q.id] = q.required
      ? z.string().min(1, "Required")
      : z.string().optional();
  }

  return z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z
      .string()
      .regex(bdPhoneRegex, "Enter a valid Bangladesh phone number (e.g. 017XXXXXXXX)"),
    cvFileName: z.string().optional(),
    coverNote: z.string().optional(),
    consent: z.boolean().refine((v) => v === true, "You must agree to continue"),
    screening: z.object(screeningShape),
  });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

interface GuestApplyFormProps {
  job: Job;
  jobSlug: string;
}

const STEPS = ["personal", "cv", "screening", "cover", "consent"] as const;

export function GuestApplyForm({ job, jobSlug }: GuestApplyFormProps) {
  const t = useTranslations("apply");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [cvFileName, setCvFileName] = useState<string>("");

  const schema = createSchema(job.screeningQuestions);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverNote: "",
      consent: false,
      screening: Object.fromEntries(job.screeningQuestions.map((q) => [q.id, ""])),
    },
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const app = await submitGuestApplication({
        jobId: job.id,
        guestInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          cvFileName: cvFileName || values.cvFileName,
          coverNote: values.coverNote,
        },
        screeningAnswers: job.screeningQuestions.map((q) => ({
          questionId: q.id,
          answer: String(values.screening[q.id] ?? ""),
        })),
      });
      router.push(`/jobs/${jobSlug}/apply/success?ref=${app.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    const fieldsByStep: (keyof FormValues | `screening.${string}`)[][] = [
      ["name", "email", "phone"],
      [],
      job.screeningQuestions.map((q) => `screening.${q.id}` as const),
      [],
      ["consent"],
    ];

    const fields = fieldsByStep[step];
    if (fields.length === 0) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      return;
    }

    form.trigger(fields as Parameters<typeof form.trigger>[0]).then((valid) => {
      if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
    });
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      form.setValue("cvFileName", file.name);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{job.title}</p>
        <Progress value={progress} className="mt-4 h-2" />
        <p className="mt-2 text-sm text-muted-foreground">
          {t("step", { current: step + 1, total: STEPS.length })}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("personalInfo")}</CardTitle>
              <CardDescription>{t("personalInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" placeholder="017XXXXXXXX" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("cvUpload")}</CardTitle>
              <CardDescription>{t("cvUploadDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/30">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm font-medium">{t("uploadCv")}</span>
                <span className="text-xs text-muted-foreground">{t("cvFormats")}</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} />
              </label>
              {cvFileName && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {cvFileName}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("screening")}</CardTitle>
              <CardDescription>{t("screeningDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.screeningQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label>
                    {q.question}
                    {q.required && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input {...form.register(`screening.${q.id}`)} />
                  {form.formState.errors.screening?.[q.id] && (
                    <p className="text-sm text-destructive">
                      {(form.formState.errors.screening[q.id] as { message?: string })?.message}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("coverNote")}</CardTitle>
              <CardDescription>{t("coverNoteDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                placeholder={t("coverNotePlaceholder")}
                {...form.register("coverNote")}
              />
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("reviewSubmit")}</CardTitle>
              <CardDescription>{t("reviewSubmitDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                <p><strong>{t("fullName")}:</strong> {form.watch("name")}</p>
                <p><strong>{t("email")}:</strong> {form.watch("email")}</p>
                <p><strong>{t("phone")}:</strong> {form.watch("phone")}</p>
                {cvFileName && <p><strong>CV:</strong> {cvFileName}</p>}
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={form.watch("consent")}
                  onCheckedChange={(v) => form.setValue("consent", v === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-snug">
                  {t("consentText")}
                </Label>
              </div>
              {form.formState.errors.consent && (
                <p className="text-sm text-destructive">{form.formState.errors.consent.message}</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            {t("back")}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              {t("next")}
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
