"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, Clock, MapPin } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const SHIFTS = ["morning", "afternoon", "night"] as const;

export function FrontlineOnboarding() {
  const t = useTranslations("frontline");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [shifts, setShifts] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  function handleComplete() {
    localStorage.setItem(
      "frontline-profile",
      JSON.stringify({ phone, name, shifts, available, completedAt: new Date().toISOString() })
    );
    toast.success(t("completed"));
    setStep(4);
  }

  return (
    <PageContainer className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        {step <= totalSteps && (
          <>
            <Progress value={progress} className="mt-4 h-2" />
            <p className="mt-2 text-sm text-muted-foreground">{t("step", { current: step, total: totalSteps })}</p>
          </>
        )}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4" />
              {t("phoneStep")}
            </CardTitle>
            <CardDescription>{t("phoneDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("phone")}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
            </div>
            <Button onClick={() => setStep(2)} disabled={!phone || !name}>
              {t("continue")}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              {t("shiftStep")}
            </CardTitle>
            <CardDescription>{t("shiftDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SHIFTS.map((shift) => (
              <div key={shift} className="flex items-center gap-2">
                <Checkbox
                  checked={shifts.includes(shift)}
                  onCheckedChange={(checked) => {
                    setShifts((prev) =>
                      checked ? [...prev, shift] : prev.filter((s) => s !== shift)
                    );
                  }}
                />
                <Label>{t(`shifts.${shift}`)}</Label>
              </div>
            ))}
            <Button onClick={() => setStep(3)} disabled={shifts.length === 0}>
              {t("continue")}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {t("availabilityStep")}
            </CardTitle>
            <CardDescription>{t("availabilityDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={available} onCheckedChange={(c) => setAvailable(!!c)} />
              <Label>{t("availableNow")}</Label>
            </div>
            <Button onClick={handleComplete}>{t("complete")}</Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="text-center">
          <CardContent className="pt-8 space-y-2">
            <h2 className="text-xl font-bold">{t("successTitle")}</h2>
            <p className="text-muted-foreground">{t("successDescription")}</p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
