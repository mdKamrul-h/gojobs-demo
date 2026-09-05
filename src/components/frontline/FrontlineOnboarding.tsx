"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, Clock, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getJobs } from "@/lib/mock/services/jobs";
import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

const SHIFTS = ["morning", "afternoon", "night"] as const;
const fieldClass = "h-11 text-base";
const tapClass = "h-11 min-w-[44px] text-base";

export function FrontlineOnboarding() {
  const t = useTranslations("frontline");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [shifts, setShifts] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);
  const [matches, setMatches] = useState<Job[]>([]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (step !== 4) return;
    getJobs(undefined, { field: "date", direction: "desc" }).then((jobs) => {
      setMatches(jobs.slice(0, 3));
    });
  }, [step]);

  function handleComplete() {
    localStorage.setItem(
      "frontline-profile",
      JSON.stringify({ phone, name, shifts, available, completedAt: new Date().toISOString() })
    );
    toast.success(t("completed"));
    setStep(4);
  }

  return (
    <PageContainer className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t("subtitle")}</p>
        {step <= totalSteps && (
          <>
            <Progress value={progress} className="mt-4 h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t("step", { current: step, total: totalSteps })}
            </p>
          </>
        )}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5" />
              {t("phoneStep")}
            </CardTitle>
            <CardDescription className="text-base">{t("phoneDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frontline-phone" className="text-base">
                {t("phone")}
              </Label>
              <Input
                id="frontline-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                type="tel"
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frontline-name" className="text-base">
                {t("name")}
              </Label>
              <Input
                id="frontline-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className={fieldClass}
              />
            </div>
            <Button className={tapClass} onClick={() => setStep(2)} disabled={!phone || !name}>
              {t("continue")}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              {t("shiftStep")}
            </CardTitle>
            <CardDescription className="text-base">{t("shiftDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SHIFTS.map((shift) => (
              <div key={shift} className="flex min-h-11 items-center gap-3">
                <Checkbox
                  id={`shift-${shift}`}
                  checked={shifts.includes(shift)}
                  onCheckedChange={(checked) => {
                    setShifts((prev) =>
                      checked ? [...prev, shift] : prev.filter((s) => s !== shift)
                    );
                  }}
                />
                <Label htmlFor={`shift-${shift}`} className="text-base">
                  {t(`shifts.${shift}`)}
                </Label>
              </div>
            ))}
            <Button className={tapClass} onClick={() => setStep(3)} disabled={shifts.length === 0}>
              {t("continue")}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              {t("availabilityStep")}
            </CardTitle>
            <CardDescription className="text-base">{t("availabilityDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex min-h-11 items-center gap-3">
              <Checkbox
                id="available-now"
                checked={available}
                onCheckedChange={(c) => setAvailable(!!c)}
              />
              <Label htmlFor="available-now" className="text-base">
                {t("availableNow")}
              </Label>
            </div>
            <Button className={tapClass} onClick={handleComplete}>
              {t("complete")}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardContent className="space-y-4 pt-8 text-center">
            <h2 className="text-2xl font-bold">{t("successTitle")}</h2>
            <p className="text-base text-muted-foreground">{t("successDescription")}</p>
            <Link href="/jobs" className={cn(buttonVariants(), tapClass, "inline-flex")}>
              {t("browseJobs")}
            </Link>
            {matches.length > 0 && (
              <div className="space-y-2 text-left">
                <p className="text-sm font-medium">{t("matchingJobs")}</p>
                {matches.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="block min-h-11 rounded-md border px-3 py-3 text-sm font-medium hover:bg-muted/50"
                  >
                    {job.title}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
